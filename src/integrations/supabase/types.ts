export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          priority: string | null
          related_id: string | null
          related_to: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          related_id?: string | null
          related_to?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          related_id?: string | null
          related_to?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          rules: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          rules?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          rules?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbots: {
        Row: {
          active: boolean | null
          created_at: string | null
          delay_seconds: number | null
          id: string
          media_url: string | null
          response_content: string | null
          response_type: string | null
          trigger_type: string
          trigger_value: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          media_url?: string | null
          response_content?: string | null
          response_type?: string | null
          trigger_type: string
          trigger_value?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          media_url?: string | null
          response_content?: string | null
          response_type?: string | null
          trigger_type?: string
          trigger_value?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_ltv: {
        Row: {
          calculated_ltv: number | null
          client_id: string | null
          company_id: string
          first_purchase_date: string | null
          id: string
          last_purchase_date: string | null
          purchase_frequency: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          calculated_ltv?: number | null
          client_id?: string | null
          company_id: string
          first_purchase_date?: string | null
          id?: string
          last_purchase_date?: string | null
          purchase_frequency?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          calculated_ltv?: number | null
          client_id?: string | null
          company_id?: string
          first_purchase_date?: string | null
          id?: string
          last_purchase_date?: string | null
          purchase_frequency?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_ltv_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_nps: {
        Row: {
          client_id: string | null
          company_id: string
          created_at: string | null
          feedback: string | null
          id: string
          score: number
        }
        Insert: {
          client_id?: string | null
          company_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          score: number
        }
        Update: {
          client_id?: string | null
          company_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_nps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_satisfaction: {
        Row: {
          category: string
          client_id: string | null
          comments: string | null
          company_id: string
          created_at: string | null
          id: string
          rating: number
        }
        Insert: {
          category: string
          client_id?: string | null
          comments?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          rating: number
        }
        Update: {
          category?: string
          client_id?: string | null
          comments?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_satisfaction_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          city: string | null
          company_id: string
          contact: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact: string | null
          name: string
          phone: string | null
          segment: string | null
          state: string | null
          status: string
          street: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          company_id: string
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          phone?: string | null
          segment?: string | null
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string
          contact?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          phone?: string | null
          segment?: string | null
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_goals: {
        Row: {
          company_id: string
          created_at: string | null
          current_value: number | null
          goal_type: string
          id: string
          period_end: string
          period_start: string
          target_value: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          current_value?: number | null
          goal_type: string
          id?: string
          period_end: string
          period_start: string
          target_value: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          current_value?: number | null
          goal_type?: string
          id?: string
          period_end?: string
          period_start?: string
          target_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      company_subscriptions: {
        Row: {
          company_id: string
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          created_at: string | null
          delay_seconds: number | null
          first_msg_daily: boolean | null
          id: string
          keyword_trigger: Json | null
          user_id: string | null
          welcome_message: string | null
        }
        Insert: {
          created_at?: string | null
          delay_seconds?: number | null
          first_msg_daily?: boolean | null
          id?: string
          keyword_trigger?: Json | null
          user_id?: string | null
          welcome_message?: string | null
        }
        Update: {
          created_at?: string | null
          delay_seconds?: number | null
          first_msg_daily?: boolean | null
          id?: string
          keyword_trigger?: Json | null
          user_id?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          list_id: string | null
          name: string
          phone: string
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          list_id?: string | null
          name: string
          phone: string
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          list_id?: string | null
          name?: string
          phone?: string
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_groups: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          member_ids: string[]
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          member_ids: string[]
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          member_ids?: string[]
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_configurations: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          layout_config: Json | null
          updated_at: string | null
          user_id: string
          widget_preferences: Json | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          layout_config?: Json | null
          updated_at?: string | null
          user_id: string
          widget_preferences?: Json | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          layout_config?: Json | null
          updated_at?: string | null
          user_id?: string
          widget_preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string
          content: string | null
          created_at: string | null
          created_by: string | null
          file_type: string | null
          folder_path: string | null
          id: string
          last_edited_by: string | null
          size_kb: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          file_type?: string | null
          folder_path?: string | null
          id?: string
          last_edited_by?: string | null
          size_kb?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          file_type?: string | null
          folder_path?: string | null
          id?: string
          last_edited_by?: string | null
          size_kb?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          reference_id: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          reference_id?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_stages: {
        Row: {
          color: string | null
          company_id: string
          created_at: string | null
          id: string
          name: string
          order_index: number
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          order_index: number
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      goals: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          current_value: number | null
          description: string | null
          id: string
          status: string | null
          target_date: string
          target_value: number
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          status?: string | null
          target_date: string
          target_value: number
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          status?: string | null
          target_date?: string
          target_value?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      imports: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          errors: Json | null
          file_name: string
          file_url: string | null
          id: string
          import_type: string
          imported_count: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          errors?: Json | null
          file_name: string
          file_url?: string | null
          id?: string
          import_type: string
          imported_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          errors?: Json | null
          file_name?: string
          file_url?: string | null
          id?: string
          import_type?: string
          imported_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_conversations: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          participant_ids: string[]
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          participant_ids: string[]
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          participant_ids?: string[]
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          file_url: string | null
          id: string
          message_type: string | null
          read_by: string[] | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_by?: string[] | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_by?: string[] | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "internal_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_states: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          kanban_type: string
          state: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          kanban_type: string
          state: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          kanban_type?: string
          state?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kanban_states_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          lead_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          lead_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          lead_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "sales_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          priority: string
          source: string | null
          status: string
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          priority?: string
          source?: string | null
          status?: string
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          priority?: string
          source?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          contact_ids: string[] | null
          created_at: string | null
          description: string | null
          filters: Json | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          contact_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          contact_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          size_kb: number | null
          type: string | null
          url: string | null
          used_in: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          size_kb?: number | null
          type?: string | null
          url?: string | null
          used_in?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          size_kb?: number | null
          type?: string | null
          url?: string | null
          used_in?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          company_id: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          participants: number | null
          status: string
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          participants?: number | null
          status?: string
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          participants?: number | null
          status?: string
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mind_maps: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          edges: Json | null
          id: string
          nodes: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          edges?: Json | null
          id?: string
          nodes?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          edges?: Json | null
          id?: string
          nodes?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mind_maps_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          client_activities: boolean | null
          created_at: string | null
          email_alerts: boolean | null
          id: string
          meeting_reminders: boolean | null
          new_leads: boolean | null
          payments: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_activities?: boolean | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          meeting_reminders?: boolean | null
          new_leads?: boolean | null
          payments?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_activities?: boolean | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          meeting_reminders?: boolean | null
          new_leads?: boolean | null
          payments?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          company_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string
          description: string | null
          feature_key: string
          feature_value: string
          id: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_key: string
          feature_value: string
          id?: string
          plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_key?: string
          feature_value?: string
          id?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          code: string
          created_at: string
          currency: string
          description: string | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      production_folders: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_folders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "production_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_projects: {
        Row: {
          collaborators: string[] | null
          company_id: string | null
          created_at: string
          created_by: string
          data: Json | null
          description: string | null
          folder_id: string | null
          id: string
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          collaborators?: string[] | null
          company_id?: string | null
          created_at?: string
          created_by: string
          data?: Json | null
          description?: string | null
          folder_id?: string | null
          id?: string
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          collaborators?: string[] | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          data?: Json | null
          description?: string | null
          folder_id?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles_companies: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          status: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role?: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_companies_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "company_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          company_id: string
          completed_date: string | null
          created_at: string | null
          id: string
          milestone_name: string
          status: string | null
          target_date: string
          task_id: string | null
        }
        Insert: {
          company_id: string
          completed_date?: string | null
          created_at?: string | null
          id?: string
          milestone_name: string
          status?: string | null
          target_date: string
          task_id?: string | null
        }
        Update: {
          company_id?: string
          completed_date?: string | null
          created_at?: string | null
          id?: string
          milestone_name?: string
          status?: string | null
          target_date?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_leads: {
        Row: {
          assigned_to: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          priority: string | null
          source: string | null
          stage: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          priority?: string | null
          source?: string | null
          stage?: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          priority?: string | null
          source?: string | null
          stage?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          contact_id: string | null
          created_at: string | null
          failed: boolean | null
          id: string
          list_id: string | null
          media_url: string | null
          message: string
          scheduled_at: string
          sent: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          failed?: boolean | null
          id?: string
          list_id?: string | null
          media_url?: string | null
          message: string
          scheduled_at: string
          sent?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          failed?: boolean | null
          id?: string
          list_id?: string | null
          media_url?: string | null
          message?: string
          scheduled_at?: string
          sent?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          company_id: string
          completion: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          priority: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          company_id: string
          completion?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          priority?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          company_id?: string
          completion?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          priority?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          company_id: string
          created_at: string | null
          granted: boolean | null
          granted_by: string | null
          id: string
          permission_key: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          granted?: boolean | null
          granted_by?: string | null
          id?: string
          permission_key: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          granted?: boolean | null
          granted_by?: string | null
          id?: string
          permission_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          company_id: string | null
          created_at: string | null
          dashboard_config: Json | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          dashboard_config?: Json | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          dashboard_config?: Json | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_autoresponders: {
        Row: {
          active: boolean | null
          created_at: string | null
          delay_seconds: number | null
          id: string
          keyword: string | null
          media_url: string | null
          response: string | null
          session_id: string | null
          trigger_type: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          keyword?: string | null
          media_url?: string | null
          response?: string | null
          session_id?: string | null
          trigger_type?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          delay_seconds?: number | null
          id?: string
          keyword?: string | null
          media_url?: string | null
          response?: string | null
          session_id?: string | null
          trigger_type?: string | null
        }
        Relationships: []
      }
      whatsapp_broadcasts: {
        Row: {
          created_at: string | null
          id: string
          media_url: string | null
          message: string | null
          profile_id: string | null
          scheduled_for: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          profile_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          profile_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_broadcasts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_contacts: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          phone_number: string | null
          profile_id: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          profile_id?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          profile_id?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_flows: {
        Row: {
          active: boolean | null
          created_at: string | null
          flow_json: Json | null
          id: string
          name: string | null
          profile_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          flow_json?: Json | null
          id?: string
          name?: string | null
          profile_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          flow_json?: Json | null
          id?: string
          name?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_flows_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          created_at: string | null
          from_me: boolean | null
          id: string
          message: string | null
          number: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message?: string | null
          number: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          from_me?: boolean | null
          id?: string
          message?: string | null
          number?: string
          session_id?: string
        }
        Relationships: []
      }
      whatsapp_sessions: {
        Row: {
          connected_at: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          name: string | null
          phone: string | null
          profile_id: string | null
          qr_code: string | null
          session_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          name?: string | null
          phone?: string | null
          profile_id?: string | null
          qr_code?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          name?: string | null
          phone?: string | null
          profile_id?: string | null
          qr_code?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_company_profile_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_company_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_company_member: {
        Args: { user_id: string; company_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
