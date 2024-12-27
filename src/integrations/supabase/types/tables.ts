export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Tables {
  anonymous_generation_count: {
    Row: {
      created_at: string | null
      generation_count: number | null
      id: number
      ip_address: string | null
    }
    Insert: {
      created_at?: string | null
      generation_count?: number | null
      id?: never
      ip_address?: string | null
    }
    Update: {
      created_at?: string | null
      generation_count?: number | null
      id?: never
      ip_address?: string | null
    }
    Relationships: []
  }
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
  gallery_pdfs: {
    Row: {
      id: string
      user_id: string
      title: string
      description: string | null
      pdf_url: string
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      description?: string | null
      pdf_url: string
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      description?: string | null
      pdf_url?: string
      created_at?: string
      updated_at?: string
    }
    Relationships: [
      {
        foreignKeyName: "gallery_pdfs_user_id_fkey"
        columns: ["user_id"]
        referencedRelation: "users"
        referencedColumns: ["id"]
      }
    ]
  }
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