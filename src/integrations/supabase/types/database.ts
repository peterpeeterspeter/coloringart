import { Tables } from './tables'
import { Views } from './views'

export interface Database {
  public: {
    Tables: Tables
    Views: Views
    Functions: {
      count_anonymous_generations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type { Tables }
export type { Views }