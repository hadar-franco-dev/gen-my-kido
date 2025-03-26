interface ImageToImagePayload {
  prompt: string;
  modelId: string;
  imageUrl: string;
  width: number;
  height: number;
  num_images: number;
  negative_prompt?: string;
  strength?: number;
  public: boolean;
  promptMagic: boolean;
} 