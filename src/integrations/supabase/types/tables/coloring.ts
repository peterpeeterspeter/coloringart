import { Json } from '../base';

export interface ColoringTypes {
  coloring_plates: {
    Row: {
      created_at: string | null
      description: string | null
      id: string
      image_url: string | null
      name: string
      prompt: string
      settings: Json | null
      updated_at: string | null
      user_id: string
    }
    Insert: {
      created_at?: string | null
      description?: string | null
      id?: string
      image_url?: string | null
      name: string
      prompt: string
      settings?: Json | null
      updated_at?: string | null
      user_id: string
    }
    Update: {
      created_at?: string | null
      description?: string | null
      id?: string
      image_url?: string | null
      name?: string
      prompt?: string
      settings?: Json | null
      updated_at?: string | null
      user_id?: string
    }
    Relationships: []
  }
}