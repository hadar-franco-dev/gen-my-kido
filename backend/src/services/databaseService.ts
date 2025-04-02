import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { withRetry, defaultRetryConfig } from '../lib/retry';

export class DatabaseService {
  private supabase;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  // Book Scripts
  async createBookScript(data: Database['public']['Tables']['book_scripts']['Insert']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('book_scripts')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async getBookScript(id: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('book_scripts')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  async getBookScriptsByCategory(categoryId: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('book_scripts')
        .select()
        .eq('category', categoryId);

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  // Categories
  async createCategory(data: Database['public']['Tables']['category']['Insert']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('category')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async getCategory(id: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('category')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  async getCategoriesByType(typeId: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('category')
        .select()
        .eq('type', typeId);

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  // Category Types
  async createCategoryType(data: Database['public']['Tables']['category_types']['Insert']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('category_types')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async getCategoryType(id: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('category_types')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  // Generations
  async createGeneration(data: Database['public']['Tables']['generations']['Insert']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('generations')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async updateGeneration(id: string, data: Database['public']['Tables']['generations']['Update']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('generations')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async getGeneration(id: string) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('generations')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  async getUserGenerations(userId: string) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('generations')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  // User Profiles
  async createUserProfile(data: Database['public']['Tables']['user_profiles']['Insert']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('user_profiles')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async updateUserProfile(id: string, data: Database['public']['Tables']['user_profiles']['Update']) {
    return withRetry(async () => {
      const { data: result, error } = await this.supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    }, defaultRetryConfig);
  }

  async getUserProfile(userId: string) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select()
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }

  async updateUserCredits(userId: string, credits: number) {
    return withRetry(async () => {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({ credits })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, defaultRetryConfig);
  }
} 