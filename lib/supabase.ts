import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side supabase (limited by RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin supabase (bypasses RLS) - only works on server
export const getSupabaseAdmin = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          company: string
          email: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          email: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          email?: string
          phone?: string | null
          created_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          name: string
          client: string
          client_id: string | null
          date_sent: string | null
          status: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected'
          version: number
          value: number
          created_at: string
          updated_at: string
          slug: string
          content_json: any
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          client: string
          client_id?: string | null
          date_sent?: string | null
          status?: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected'
          version?: number
          value?: number
          created_at?: string
          updated_at?: string
          slug: string
          content_json?: any
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          client?: string
          client_id?: string | null
          date_sent?: string | null
          status?: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected'
          version?: number
          value?: number
          created_at?: string
          updated_at?: string
          slug?: string
          content_json?: any
          created_by?: string | null
        }
      }
      proposal_versions: {
        Row: {
          id: string
          proposal_id: string
          version_number: number
          changes: string | null
          content_snapshot: any
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          proposal_id: string
          version_number: number
          changes?: string | null
          content_snapshot?: any
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          proposal_id?: string
          version_number?: number
          changes?: string | null
          content_snapshot?: any
          created_at?: string
          created_by?: string
        }
      }
      ai_chat_history: {
        Row: {
          id: string
          proposal_id: string | null
          user_message: string
          ai_response: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          proposal_id?: string | null
          user_message: string
          ai_response: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          proposal_id?: string | null
          user_message?: string
          ai_response?: string
          created_at?: string
          created_by?: string
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

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Proposal = Database['public']['Tables']['proposals']['Row']
export type ProposalVersion = Database['public']['Tables']['proposal_versions']['Row']
export type ChatHistory = Database['public']['Tables']['ai_chat_history']['Row']