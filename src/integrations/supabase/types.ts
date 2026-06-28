export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          establishment_id: string
          id: string
          is_active: boolean
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          establishment_id: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          establishment_id?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_years_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          arrival_time: string | null
          created_at: string
          id: string
          justification: string | null
          session_id: string
          status: string
          student_id: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          session_id: string
          status?: string
          student_id: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          session_id?: string
          status?: string
          student_id?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          class_id: string
          closed_at: string | null
          closed_by: string | null
          created_at: string
          date: string
          id: string
          is_closed: boolean
          session_type: string
        }
        Insert: {
          class_id: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          date?: string
          id?: string
          is_closed?: boolean
          session_type?: string
        }
        Update: {
          class_id?: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          date?: string
          id?: string
          is_closed?: boolean
          session_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          establishment_id: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          establishment_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          establishment_id?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_subjects: {
        Row: {
          class_id: string
          coefficient: number
          created_at: string
          id: string
          subject_id: string
          teacher_id: string | null
        }
        Insert: {
          class_id: string
          coefficient?: number
          created_at?: string
          id?: string
          subject_id: string
          teacher_id?: string | null
        }
        Update: {
          class_id?: string
          coefficient?: number
          created_at?: string
          id?: string
          subject_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year_id: string
          capacity: number
          code: string
          created_at: string
          establishment_id: string
          id: string
          is_active: boolean
          level_id: string
          main_teacher_id: string | null
          name: string
          room: string | null
          series: string | null
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          capacity?: number
          code: string
          created_at?: string
          establishment_id: string
          id?: string
          is_active?: boolean
          level_id: string
          main_teacher_id?: string | null
          name: string
          room?: string | null
          series?: string | null
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          capacity?: number
          code?: string
          created_at?: string
          establishment_id?: string
          id?: string
          is_active?: boolean
          level_id?: string
          main_teacher_id?: string | null
          name?: string
          room?: string | null
          series?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_main_teacher_id_fkey"
            columns: ["main_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discipline_records: {
        Row: {
          conduct_deduction: number | null
          created_at: string
          date: string
          description: string
          establishment_id: string
          given_by: string | null
          id: string
          record_type: string
          student_id: string
          updated_at: string
        }
        Insert: {
          conduct_deduction?: number | null
          created_at?: string
          date?: string
          description: string
          establishment_id: string
          given_by?: string | null
          id?: string
          record_type: string
          student_id: string
          updated_at?: string
        }
        Update: {
          conduct_deduction?: number | null
          created_at?: string
          date?: string
          description?: string
          establishment_id?: string
          given_by?: string | null
          id?: string
          record_type?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipline_records_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipline_records_given_by_fkey"
            columns: ["given_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipline_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          authorization_number: string | null
          city: string | null
          code: string
          commune: string | null
          country: string
          created_at: string
          director_signature_url: string | null
          email: string | null
          gps_coordinates: string | null
          header_config: Json | null
          id: string
          inspection: string | null
          logo_url: string | null
          manager_signature_url: string | null
          matricule_format: string | null
          matricule_sequence: number | null
          ministry: string | null
          name: string
          pedagogy_system: string | null
          phone_primary: string | null
          phone_secondary: string | null
          quartier: string | null
          republic_motto: string | null
          republic_name: string | null
          secondary_logo_url: string | null
          settings: Json | null
          sigle: string | null
          slogan: string | null
          stamp_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          authorization_number?: string | null
          city?: string | null
          code: string
          commune?: string | null
          country?: string
          created_at?: string
          director_signature_url?: string | null
          email?: string | null
          gps_coordinates?: string | null
          header_config?: Json | null
          id?: string
          inspection?: string | null
          logo_url?: string | null
          manager_signature_url?: string | null
          matricule_format?: string | null
          matricule_sequence?: number | null
          ministry?: string | null
          name: string
          pedagogy_system?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          quartier?: string | null
          republic_motto?: string | null
          republic_name?: string | null
          secondary_logo_url?: string | null
          settings?: Json | null
          sigle?: string | null
          slogan?: string | null
          stamp_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          authorization_number?: string | null
          city?: string | null
          code?: string
          commune?: string | null
          country?: string
          created_at?: string
          director_signature_url?: string | null
          email?: string | null
          gps_coordinates?: string | null
          header_config?: Json | null
          id?: string
          inspection?: string | null
          logo_url?: string | null
          manager_signature_url?: string | null
          matricule_format?: string | null
          matricule_sequence?: number | null
          ministry?: string | null
          name?: string
          pedagogy_system?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          quartier?: string | null
          republic_motto?: string | null
          republic_name?: string | null
          secondary_logo_url?: string | null
          settings?: Json | null
          sigle?: string | null
          slogan?: string | null
          stamp_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string
          description: string
          establishment_id: string
          expense_date: string
          expense_type: string
          id: string
          paid_to: string | null
          receipt_url: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string
          description: string
          establishment_id: string
          expense_date?: string
          expense_type: string
          id?: string
          paid_to?: string | null
          receipt_url?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string
          description?: string
          establishment_id?: string
          expense_date?: string
          expense_type?: string
          id?: string
          paid_to?: string | null
          receipt_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_entries: {
        Row: {
          class_subject_id: string
          created_at: string
          date: string
          grade_type_id: string
          id: string
          is_validated: boolean
          max_grade: number
          term_id: string
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          class_subject_id: string
          created_at?: string
          date?: string
          grade_type_id: string
          id?: string
          is_validated?: boolean
          max_grade?: number
          term_id: string
          title: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          class_subject_id?: string
          created_at?: string
          date?: string
          grade_type_id?: string
          id?: string
          is_validated?: boolean
          max_grade?: number
          term_id?: string
          title?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_entries_class_subject_id_fkey"
            columns: ["class_subject_id"]
            isOneToOne: false
            referencedRelation: "class_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_entries_grade_type_id_fkey"
            columns: ["grade_type_id"]
            isOneToOne: false
            referencedRelation: "grade_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_entries_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_entries_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_types: {
        Row: {
          code: string
          created_at: string
          default_weight: number
          establishment_id: string
          id: string
          is_official: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          default_weight?: number
          establishment_id: string
          id?: string
          is_official?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          default_weight?: number
          establishment_id?: string
          id?: string
          is_official?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "grade_types_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          academic_year_id: string | null
          amount: number
          created_at: string
          description: string | null
          due_date: string | null
          establishment_id: string
          id: string
          invoice_number: string
          invoice_type: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          academic_year_id?: string | null
          amount: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          establishment_id: string
          id?: string
          invoice_number: string
          invoice_type: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          establishment_id?: string
          id?: string
          invoice_number?: string
          invoice_type?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          code: string
          created_at: string
          description: string | null
          establishment_id: string
          id: string
          is_active: boolean
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          establishment_id: string
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          establishment_id?: string
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          establishment_id: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profession: string | null
          profile_id: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          establishment_id: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profession?: string | null
          profile_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          establishment_id?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profession?: string | null
          profile_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parents_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          receipt_number: string | null
          received_by: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          receipt_number?: string | null
          received_by?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          receipt_number?: string | null
          received_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          establishment_id: string | null
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          establishment_id?: string | null
          full_name: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          establishment_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          contract_type: string | null
          created_at: string
          department: string | null
          diploma: string | null
          employee_id: string | null
          establishment_id: string
          first_name: string
          hire_date: string | null
          id: string
          is_active: boolean
          last_name: string
          profile_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          contract_type?: string | null
          created_at?: string
          department?: string | null
          diploma?: string | null
          employee_id?: string | null
          establishment_id: string
          first_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean
          last_name: string
          profile_id?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          contract_type?: string | null
          created_at?: string
          department?: string | null
          diploma?: string | null
          employee_id?: string | null
          establishment_id?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean
          last_name?: string
          profile_id?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grades: {
        Row: {
          comment: string | null
          created_at: string
          grade: number | null
          grade_entry_id: string
          id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          grade?: number | null
          grade_entry_id: string
          id?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          grade?: number | null
          grade_entry_id?: string
          id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_grade_entry_id_fkey"
            columns: ["grade_entry_id"]
            isOneToOne: false
            referencedRelation: "grade_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parents: {
        Row: {
          created_at: string
          is_primary: boolean
          parent_id: string
          relationship: string
          student_id: string
        }
        Insert: {
          created_at?: string
          is_primary?: boolean
          parent_id: string
          relationship?: string
          student_id: string
        }
        Update: {
          created_at?: string
          is_primary?: boolean
          parent_id?: string
          relationship?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_certificate_url: string | null
          class_id: string | null
          conduct_grade: number | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          enrollment_date: string
          establishment_id: string
          first_name: string
          gender: string
          id: string
          is_repeating: boolean
          last_name: string
          matricule: string
          nationality: string | null
          phone: string | null
          photo_url: string | null
          place_of_birth: string | null
          school_certificate_url: string | null
          series: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_certificate_url?: string | null
          class_id?: string | null
          conduct_grade?: number | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrollment_date?: string
          establishment_id: string
          first_name: string
          gender: string
          id?: string
          is_repeating?: boolean
          last_name: string
          matricule: string
          nationality?: string | null
          phone?: string | null
          photo_url?: string | null
          place_of_birth?: string | null
          school_certificate_url?: string | null
          series?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_certificate_url?: string | null
          class_id?: string | null
          conduct_grade?: number | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrollment_date?: string
          establishment_id?: string
          first_name?: string
          gender?: string
          id?: string
          is_repeating?: boolean
          last_name?: string
          matricule?: string
          nationality?: string | null
          phone?: string | null
          photo_url?: string | null
          place_of_birth?: string | null
          school_certificate_url?: string | null
          series?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          default_coefficient: number
          description: string | null
          establishment_id: string
          group_type: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          default_coefficient?: number
          description?: string | null
          establishment_id: string
          group_type?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          default_coefficient?: number
          description?: string | null
          establishment_id?: string
          group_type?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          academic_year_id: string
          created_at: string
          end_date: string
          establishment_id: string
          id: string
          is_active: boolean
          name: string
          start_date: string
          term_number: number
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          end_date: string
          establishment_id: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
          term_number: number
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          end_date?: string
          establishment_id?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
          term_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "terms_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_slots: {
        Row: {
          academic_year_id: string | null
          class_id: string
          class_subject_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_recurring: boolean
          room: string | null
          start_time: string
        }
        Insert: {
          academic_year_id?: string | null
          class_id: string
          class_subject_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_recurring?: boolean
          room?: string | null
          start_time: string
        }
        Update: {
          academic_year_id?: string | null
          class_id?: string
          class_subject_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_recurring?: boolean
          room?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_slots_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_slots_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_slots_class_subject_id_fkey"
            columns: ["class_subject_id"]
            isOneToOne: false
            referencedRelation: "class_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { user_id: string }; Returns: string }
      is_establishment_director: {
        Args: { est_id: string; user_id: string }
        Returns: boolean
      }
      is_establishment_member: {
        Args: { est_id: string; user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
