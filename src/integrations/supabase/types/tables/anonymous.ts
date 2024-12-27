import { Json } from '../base';

export interface AnonymousTypes {
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
}