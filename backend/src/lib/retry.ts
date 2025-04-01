export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  shouldRetry?: (error: any) => boolean;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if we should retry this error
      if (config.shouldRetry && !config.shouldRetry(error)) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === config.maxAttempts) {
        throw new RetryError(
          `Operation failed after ${attempt} attempts`,
          attempt,
          lastError
        );
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
      
      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

// Helper function to check if an error is a rate limit error
export function isRateLimitError(error: any): boolean {
  if (error?.response?.status === 429) return true;
  if (error?.response?.data?.error?.includes('rate limit')) return true;
  if (error?.message?.includes('rate limit')) return true;
  return false;
}

// Default retry configuration for API calls
export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000,    // 10 seconds
  backoffFactor: 2,   // Double the delay each time
  shouldRetry: (error) => {
    // Retry on rate limits and network errors
    return isRateLimitError(error) || 
           error?.code === 'ECONNRESET' || 
           error?.code === 'ETIMEDOUT' ||
           error?.response?.status >= 500;
  }
}; 