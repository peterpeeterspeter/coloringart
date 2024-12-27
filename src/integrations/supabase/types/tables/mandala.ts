import { Json } from '../base';

export interface MandalaTypes {
  mandala_jobs: {
    Row: {
      completed_at: string | null
      created_at: string | null
      error: string | null
      id: string
      image_url: string | null
      settings: Json | null
      status: string
      user_id: string | null
    }
    Insert: {
      completed_at?: string | null
      created_at?: string | null
      error?: string | null
      id?: string
      image_url?: string | null
      settings?: Json | null
      status: string
      user_id?: string | null
    }
    Update: {
      completed_at?: string | null
      created_at?: string | null
      error?: string | null
      id?: string
      image_url?: string | null
      settings?: Json | null
      status?: string
      user_id?: string | null
    }
    Relationships: []
  }
  mandalas: {
    Row: {
      created_at: string | null
      description: string | null
      id: string
      name: string
      settings: Json | null
      updated_at: string | null
      user_id: string
    }
    Insert: {
      created_at?: string | null
      description?: string | null
      id?: string
      name: string
      settings?: Json | null
      updated_at?: string | null
      user_id: string
    }
    Update: {
      created_at?: string | null
      description?: string | null
      id?: string
      name?: string
      settings?: Json | null
      updated_at?: string | null
      user_id?: string
    }
    Relationships: []
  }
}