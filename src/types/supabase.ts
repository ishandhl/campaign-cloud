
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
      campaigns: {
        Row: {
          id: string
          title: string
          description: string
          short_description: string
          cover_image: string
          category: string
          goal_amount: number
          current_amount: number
          start_date: string
          end_date: string
          creator_id: string
          status: "draft" | "pending" | "active" | "funded" | "failed"
          backers: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          short_description: string
          cover_image: string
          category: string
          goal_amount: number
          current_amount?: number
          start_date: string
          end_date: string
          creator_id: string
          status?: "draft" | "pending" | "active" | "funded" | "failed"
          backers?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          short_description?: string
          cover_image?: string
          category?: string
          goal_amount?: number
          current_amount?: number
          start_date?: string
          end_date?: string
          creator_id?: string
          status?: "draft" | "pending" | "active" | "funded" | "failed"
          backers?: number
          created_at?: string
        }
      }
      campaign_updates: {
        Row: {
          id: string
          campaign_id: string
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          content?: string
          created_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          user_id: string
          campaign_id: string
          amount: number
          status: "pending" | "completed" | "failed"
          payment_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id: string
          amount: number
          status?: "pending" | "completed" | "failed"
          payment_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string
          amount?: number
          status?: "pending" | "completed" | "failed"
          payment_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          type: "campaign_update" | "contribution" | "system"
          related_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          type: "campaign_update" | "contribution" | "system"
          related_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          type?: "campaign_update" | "contribution" | "system"
          related_id?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: "deposit" | "withdrawal" | "contribution" | "refund"
          amount: number
          status: "pending" | "completed" | "failed"
          payment_id?: string
          campaign_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "deposit" | "withdrawal" | "contribution" | "refund"
          amount: number
          status?: "pending" | "completed" | "failed"
          payment_id?: string
          campaign_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "deposit" | "withdrawal" | "contribution" | "refund"
          amount?: number
          status?: "pending" | "completed" | "failed"
          payment_id?: string
          campaign_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          profile_image?: string
          is_admin: boolean
          wallet_balance: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          profile_image?: string
          is_admin?: boolean
          wallet_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          profile_image?: string
          is_admin?: boolean
          wallet_balance?: number
          created_at?: string
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
