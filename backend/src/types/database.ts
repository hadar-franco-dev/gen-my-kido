export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      book_scripts: {
        Row: {
          id: number
          created_at: string
          updated_at: string | null
          en_pages_text: Json | null
          he_pages_text: Json | null
          category: number | null
        }
        Insert: {
          id?: never
          created_at?: never
          updated_at?: string | null
          en_pages_text?: Json | null
          he_pages_text?: Json | null
          category?: number | null
        }
        Update: {
          id?: never
          created_at?: never
          updated_at?: string | null
          en_pages_text?: Json | null
          he_pages_text?: Json | null
          category?: number | null
        }
      }
      category: {
        Row: {
          id: number
          created_at: string
          updated_at: string | null
          he_name: string | null
          en_name: string | null
          type: number | null
        }
        Insert: {
          id?: never
          created_at?: never
          updated_at?: string | null
          he_name?: string | null
          en_name?: string | null
          type?: number | null
        }
        Update: {
          id?: never
          created_at?: never
          updated_at?: string | null
          he_name?: string | null
          en_name?: string | null
          type?: number | null
        }
      }
      category_types: {
        Row: {
          id: number
          created_at: string
          updated_at: string | null
          en_name: string | null
          he_name: string | null
        }
        Insert: {
          id?: never
          created_at?: never
          updated_at?: string | null
          en_name?: string | null
          he_name?: string | null
        }
        Update: {
          id?: never
          created_at?: never
          updated_at?: string | null
          en_name?: string | null
          he_name?: string | null
        }
      }
      generations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          prompt: string
          negative_prompt: string | null
          image_url: string
          generation_id: string
          status: 'pending' | 'completed' | 'failed'
          error: string | null
          metadata: Json | null
        }
        Insert: {
          id?: never
          created_at?: never
          user_id: string
          prompt: string
          negative_prompt?: string | null
          image_url: string
          generation_id: string
          status: 'pending' | 'completed' | 'failed'
          error?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: never
          created_at?: never
          user_id?: string
          prompt?: string
          negative_prompt?: string | null
          image_url?: string
          generation_id?: string
          status?: 'pending' | 'completed' | 'failed'
          error?: string | null
          metadata?: Json | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          credits: number
          settings: Json | null
        }
        Insert: {
          id?: never
          created_at?: never
          user_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          settings?: Json | null
        }
        Update: {
          id?: never
          created_at?: never
          user_id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          settings?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 