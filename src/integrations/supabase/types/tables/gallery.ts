import { Json } from '../base';

export interface GalleryTypes {
  gallery_pdfs: {
    Row: {
      id: string
      user_id: string
      title: string
      description: string | null
      pdf_url: string
      created_at: string | null
      updated_at: string | null
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      description?: string | null
      pdf_url: string
      created_at?: string | null
      updated_at?: string | null
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      description?: string | null
      pdf_url?: string
      created_at?: string | null
      updated_at?: string | null
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
}