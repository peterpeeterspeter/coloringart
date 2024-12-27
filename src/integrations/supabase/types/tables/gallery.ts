import { Json } from '../base';

export interface GalleryTypes {
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
}