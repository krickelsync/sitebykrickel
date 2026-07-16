export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      coupon_redemptions: {
        Row: {
          coupon_id: string
          id: string
          order_id: string | null
          redeemed_at: string
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id?: string | null
          redeemed_at?: string
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string | null
          redeemed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          expires_at: string | null
          id: string
          max_uses: number | null
          min_amount: number
          type: string
          updated_at: string
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_amount?: number
          type: string
          updated_at?: string
          used_count?: number
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_amount?: number
          type?: string
          updated_at?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      design_portfolio: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          size: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          size?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          size?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          kind: string
          order_id: string | null
          resend_id: string | null
          status: string
          to_email: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          kind: string
          order_id?: string | null
          resend_id?: string | null
          status: string
          to_email: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          order_id?: string | null
          resend_id?: string | null
          status?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          package: string | null
          status: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          package?: string | null
          status?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          package?: string | null
          status?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          addons: Json
          admin_note: string | null
          amount: number
          buyer_email: string | null
          buyer_name: string | null
          coupon_code: string | null
          created_at: string
          currency: string
          discount_amount: number
          download_url: string | null
          email_sent_at: string | null
          id: string
          install_status: string | null
          license_error: string | null
          license_issued_at: string | null
          license_key: string | null
          license_revoked_at: string | null
          paypal_capture_id: string | null
          paypal_order_id: string | null
          processing_fee: number | null
          product_id: string | null
          product_title: string
          refunded_amount: number
          refunded_at: string | null
          status: string
          subtotal: number | null
          theme_slug: string | null
        }
        Insert: {
          addons?: Json
          admin_note?: string | null
          amount: number
          buyer_email?: string | null
          buyer_name?: string | null
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number
          download_url?: string | null
          email_sent_at?: string | null
          id?: string
          install_status?: string | null
          license_error?: string | null
          license_issued_at?: string | null
          license_key?: string | null
          license_revoked_at?: string | null
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          processing_fee?: number | null
          product_id?: string | null
          product_title: string
          refunded_amount?: number
          refunded_at?: string | null
          status?: string
          subtotal?: number | null
          theme_slug?: string | null
        }
        Update: {
          addons?: Json
          admin_note?: string | null
          amount?: number
          buyer_email?: string | null
          buyer_name?: string | null
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number
          download_url?: string | null
          email_sent_at?: string | null
          id?: string
          install_status?: string | null
          license_error?: string | null
          license_issued_at?: string | null
          license_key?: string | null
          license_revoked_at?: string | null
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          processing_fee?: number | null
          product_id?: string | null
          product_title?: string
          refunded_amount?: number
          refunded_at?: string | null
          status?: string
          subtotal?: number | null
          theme_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          approved: boolean
          author_name: string
          content: string
          created_at: string
          id: string
          product_slug: string
          rating: number
          title: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          author_name: string
          content: string
          created_at?: string
          id?: string
          product_slug?: string
          rating: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          product_slug?: string
          rating?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          features: Json
          gallery: Json
          id: string
          is_published: boolean
          landing_content: Json
          original_price: number | null
          price: number
          slug: string
          sort_order: number
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          gallery?: Json
          id?: string
          is_published?: boolean
          landing_content?: Json
          original_price?: number | null
          price?: number
          slug: string
          sort_order?: number
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          gallery?: Json
          id?: string
          is_published?: boolean
          landing_content?: Json
          original_price?: number | null
          price?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          description: string | null
          download_url: string | null
          id: string
          name: string
          price: number
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          download_url?: string | null
          id?: string
          name: string
          price?: number
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          download_url?: string | null
          id?: string
          name?: string
          price?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          event: string
          id: string
          order_id: string | null
          payload: Json | null
          request_snippet: string | null
          response_snippet: string | null
          source: string
          status_code: number | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          request_snippet?: string | null
          response_snippet?: string | null
          source: string
          status_code?: number | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          request_snippet?: string | null
          response_snippet?: string | null
          source?: string
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_coupon: {
        Args: { _code: string; _order_id: string }
        Returns: boolean
      }
      validate_coupon: {
        Args: { _code: string; _total: number }
        Returns: {
          code: string
          type: string
          value: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
