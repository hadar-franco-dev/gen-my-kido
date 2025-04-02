import { DatabaseService } from '../src/services/databaseService';
import { Database } from '../src/types/database';
import { createClient } from '@supabase/supabase-js';
import { withRetry, defaultRetryConfig } from '../src/lib/retry';

type BookScriptRow = Database['public']['Tables']['book_scripts']['Row'];
type BookScriptInsert = Database['public']['Tables']['book_scripts']['Insert'];
type CategoryRow = Database['public']['Tables']['category']['Row'];
type CategoryInsert = Database['public']['Tables']['category']['Insert'];
type GenerationRow = Database['public']['Tables']['generations']['Row'];
type GenerationInsert = Database['public']['Tables']['generations']['Insert'];
type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];

// Mock environment variables
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';

// Mock retry module
jest.mock('../src/lib/retry');

// Mock Supabase client
jest.mock('@supabase/supabase-js');

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockSupabase: any;

  const mockBookScriptRow: BookScriptRow = {
    id: 1,
    category: 1,
    en_pages_text: { pages: ['Page 1'] },
    he_pages_text: { pages: ['עמוד 1'] },
    created_at: '2024-04-01T00:00:00Z',
    updated_at: null
  };

  const mockBookScriptInsert: BookScriptInsert = {
    category: 1,
    en_pages_text: { pages: ['Page 1'] },
    he_pages_text: { pages: ['עמוד 1'] }
  };

  const mockCategoryRow: CategoryRow = {
    id: 1,
    type: 1,
    en_name: 'Test Category',
    he_name: 'קטגוריית בדיקה',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: null
  };

  const mockCategoryInsert: CategoryInsert = {
    type: 1,
    en_name: 'Test Category',
    he_name: 'קטגוריית בדיקה'
  };

  const mockGenerationRow: GenerationRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    generation_id: 'gen_123',
    prompt: 'Test prompt',
    negative_prompt: null,
    image_url: 'https://example.com/image.jpg',
    status: 'completed',
    created_at: '2024-04-01T00:00:00Z',
    error: null,
    metadata: null
  };

  const mockGenerationInsert: GenerationInsert = {
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    generation_id: 'gen_123',
    prompt: 'Test prompt',
    image_url: 'https://example.com/image.jpg',
    status: 'completed'
  };

  const mockUserProfileRow: UserProfileRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    credits: 100,
    created_at: '2024-04-01T00:00:00Z',
    full_name: null,
    avatar_url: null,
    settings: null
  };

  const mockUserProfileInsert: UserProfileInsert = {
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    credits: 100
  };

  beforeEach(() => {
    process.env.SUPABASE_URL = 'http://localhost:54321';
    process.env.SUPABASE_SERVICE_KEY = 'test-service-key';

    // Create a simple mock that returns a resolved promise with data
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
          order: jest.fn().mockResolvedValue({ data: [{ id: 1 }, { id: 2 }], error: null })
        }),
        single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null })
          })
        })
      })
    };

    // Mock createClient to return our mockSupabase
    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock withRetry to pass through the function
    (withRetry as jest.Mock).mockImplementation((fn) => fn());

    databaseService = new DatabaseService();
  });

  it('should get a book script by id', async () => {
    const result = await databaseService.getBookScript(1);

    expect(result).toEqual({ id: 1 });
    expect(mockSupabase.from).toHaveBeenCalledWith('book_scripts');
    expect(mockSupabase.select).toHaveBeenCalled();
  });

  it('should create a book script', async () => {
    const bookScriptData = {
      category: 1,
      en_pages_text: { pages: ['Page 1'] },
      he_pages_text: { pages: ['עמוד 1'] }
    };

    const result = await databaseService.createBookScript(bookScriptData);

    expect(result).toEqual({ id: 1 });
    expect(mockSupabase.from).toHaveBeenCalledWith('book_scripts');
    expect(mockSupabase.insert).toHaveBeenCalledWith(bookScriptData);
  });

  it('should get book scripts by category', async () => {
    const result = await databaseService.getBookScriptsByCategory(1);

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    expect(mockSupabase.from).toHaveBeenCalledWith('book_scripts');
    expect(mockSupabase.select).toHaveBeenCalled();
  });

  describe('Categories', () => {
    it('should create a category', async () => {
      mockSupabase.single.mockResolvedValue({ data: mockCategoryRow, error: null });

      const result = await databaseService.createCategory(mockCategoryInsert);

      expect(result).toEqual(mockCategoryRow);
      expect(mockSupabase.from).toHaveBeenCalledWith('category');
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(mockSupabase.select).toHaveBeenCalled();
    });

    it('should get a category by id', async () => {
      mockSupabase.single.mockResolvedValue({ data: mockCategoryRow, error: null });

      const result = await databaseService.getCategory(1);

      expect(result).toEqual(mockCategoryRow);
      expect(mockSupabase.from).toHaveBeenCalledWith('category');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 1);
    });

    it('should get categories by type', async () => {
      const mockCategories = [mockCategoryRow];
      mockSupabase.select.mockResolvedValue({ data: mockCategories, error: null });

      const result = await databaseService.getCategoriesByType(1);

      expect(result).toEqual(mockCategories);
      expect(mockSupabase.from).toHaveBeenCalledWith('category');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('type', 1);
    });
  });

  describe('Generations', () => {
    it('should create a generation', async () => {
      mockSupabase.single.mockResolvedValue({ data: mockGenerationRow, error: null });

      const result = await databaseService.createGeneration(mockGenerationInsert);

      expect(result).toEqual(mockGenerationRow);
      expect(mockSupabase.from).toHaveBeenCalledWith('generations');
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(mockSupabase.select).toHaveBeenCalled();
    });

    it('should update a generation', async () => {
      const updatedGeneration = { ...mockGenerationRow, status: 'failed' as const };
      mockSupabase.single.mockResolvedValue({ data: updatedGeneration, error: null });

      const result = await databaseService.updateGeneration(mockGenerationRow.id, { status: 'failed' });

      expect(result).toEqual(updatedGeneration);
      expect(mockSupabase.from).toHaveBeenCalledWith('generations');
      expect(mockSupabase.update).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockGenerationRow.id);
    });

    it('should get user generations', async () => {
      const mockGenerations = [mockGenerationRow];
      mockSupabase.select.mockResolvedValue({ data: mockGenerations, error: null });

      const result = await databaseService.getUserGenerations(mockGenerationRow.user_id);

      expect(result).toEqual(mockGenerations);
      expect(mockSupabase.from).toHaveBeenCalledWith('generations');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', mockGenerationRow.user_id);
    });
  });

  describe('User Profiles', () => {
    it('should create a user profile', async () => {
      mockSupabase.single.mockResolvedValue({ data: mockUserProfileRow, error: null });

      const result = await databaseService.createUserProfile(mockUserProfileInsert);

      expect(result).toEqual(mockUserProfileRow);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(mockSupabase.select).toHaveBeenCalled();
    });

    it('should update user credits', async () => {
      const updatedProfile = { ...mockUserProfileRow, credits: 90 };
      mockSupabase.single.mockResolvedValue({ data: updatedProfile, error: null });

      const result = await databaseService.updateUserCredits(mockUserProfileRow.user_id, 90);

      expect(result).toEqual(updatedProfile);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockSupabase.update).toHaveBeenCalledWith({ credits: 90 });
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', mockUserProfileRow.user_id);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when Supabase returns an error', async () => {
      mockSupabase.single.mockResolvedValue({ data: null, error: new Error('Database error') });

      await expect(databaseService.getBookScript(1)).rejects.toThrow('Database error');
    });

    it('should retry on failure', async () => {
      let attempts = 0;
      const originalWithRetry = jest.requireActual('../src/lib/retry').withRetry;

      (withRetry as jest.Mock).mockImplementation((fn, config) => {
        attempts++;
        if (attempts === 1) {
          throw new Error('Connection timeout');
        }
        return originalWithRetry(fn, config);
      });

      mockSupabase.single.mockResolvedValue({ data: mockBookScriptRow, error: null });

      const result = await databaseService.getBookScript(1);
      expect(result).toEqual(mockBookScriptRow);
      expect(attempts).toBe(2);
    });
  });
}); 