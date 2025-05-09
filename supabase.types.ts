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
      ejercicio_variations: {
        Row: {
          descanso: number | null
          ejercicio_id: string
          notas: string | null
          peso_inicial: number | null
          repeticiones: number | null
          series: number | null
          variation_id: string
        }
        Insert: {
          descanso?: number | null
          ejercicio_id: string
          notas?: string | null
          peso_inicial?: number | null
          repeticiones?: number | null
          series?: number | null
          variation_id: string
        }
        Update: {
          descanso?: number | null
          ejercicio_id?: string
          notas?: string | null
          peso_inicial?: number | null
          repeticiones?: number | null
          series?: number | null
          variation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ejercicio_variations_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "rutina_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      exercise_equipment: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      exercise_library: {
        Row: {
          bodyPart_en: string | null
          bodyPart_es: string | null
          equipment_en: string | null
          equipment_es: string | null
          gif_url_supabase: string | null
          id: string
          instructions_en: string | null
          instructions_es: string | null
          name_en: string | null
          name_es: string | null
          secondaryMuscles_en: string | null
          secondaryMuscles_es: string | null
          target_en: string | null
          target_es: string | null
        }
        Insert: {
          bodyPart_en?: string | null
          bodyPart_es?: string | null
          equipment_en?: string | null
          equipment_es?: string | null
          gif_url_supabase?: string | null
          id: string
          instructions_en?: string | null
          instructions_es?: string | null
          name_en?: string | null
          name_es?: string | null
          secondaryMuscles_en?: string | null
          secondaryMuscles_es?: string | null
          target_en?: string | null
          target_es?: string | null
        }
        Update: {
          bodyPart_en?: string | null
          bodyPart_es?: string | null
          equipment_en?: string | null
          equipment_es?: string | null
          gif_url_supabase?: string | null
          id?: string
          instructions_en?: string | null
          instructions_es?: string | null
          name_en?: string | null
          name_es?: string | null
          secondaryMuscles_en?: string | null
          secondaryMuscles_es?: string | null
          target_en?: string | null
          target_es?: string | null
        }
        Relationships: []
      }
      exercise_primary_muscles: {
        Row: {
          exercise_id: string
          muscle_id: string
        }
        Insert: {
          exercise_id: string
          muscle_id: string
        }
        Update: {
          exercise_id?: string
          muscle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_primary_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "exercise_primary_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_secondary_muscles: {
        Row: {
          exercise_id: string
          muscle_id: string
        }
        Insert: {
          exercise_id: string
          muscle_id: string
        }
        Update: {
          exercise_id?: string
          muscle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_secondary_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "exercise_secondary_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          bodyPart_en: string | null
          bodyPart_es: string | null
          equipment_en: string | null
          equipment_es: string | null
          gif_url_supabase: string | null
          id: string
          instructions_en: string | null
          instructions_es: string | null
          name_en: string | null
          name_es: string | null
          secondaryMuscles_en: string | null
          secondaryMuscles_es: string | null
          target_en: string | null
          target_es: string | null
          uuid: string | null
        }
        Insert: {
          bodyPart_en?: string | null
          bodyPart_es?: string | null
          equipment_en?: string | null
          equipment_es?: string | null
          gif_url_supabase?: string | null
          id: string
          instructions_en?: string | null
          instructions_es?: string | null
          name_en?: string | null
          name_es?: string | null
          secondaryMuscles_en?: string | null
          secondaryMuscles_es?: string | null
          target_en?: string | null
          target_es?: string | null
          uuid?: string | null
        }
        Update: {
          bodyPart_en?: string | null
          bodyPart_es?: string | null
          equipment_en?: string | null
          equipment_es?: string | null
          gif_url_supabase?: string | null
          id?: string
          instructions_en?: string | null
          instructions_es?: string | null
          name_en?: string | null
          name_es?: string | null
          secondaryMuscles_en?: string | null
          secondaryMuscles_es?: string | null
          target_en?: string | null
          target_es?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string | null
          ejercicio_id: string | null
          fecha: string | null
          id: string
          peso: number
          repeticiones: number
        }
        Insert: {
          created_at?: string | null
          ejercicio_id?: string | null
          fecha?: string | null
          id?: string
          peso: number
          repeticiones: number
        }
        Update: {
          created_at?: string | null
          ejercicio_id?: string | null
          fecha?: string | null
          id?: string
          peso?: number
          repeticiones?: number
        }
        Relationships: []
      }
      mesociclos: {
        Row: {
          active: boolean | null
          completed: boolean | null
          created_at: string | null
          id: string
          name: string
          order: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          order: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          order?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      muscles: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      routine_exercises: {
        Row: {
          exercise_id: string
          id: string
          position: number | null
          reps: number | null
          routine_id: string
          sets: number | null
        }
        Insert: {
          exercise_id: string
          id?: string
          position?: number | null
          reps?: number | null
          routine_id: string
          sets?: number | null
        }
        Update: {
          exercise_id?: string
          id?: string
          position?: number | null
          reps?: number | null
          routine_id?: string
          sets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id"]
          },
        ]
      }
      rutina_schedule: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          rutina_id: string | null
          variation_id: string | null
          week_number: number
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          rutina_id?: string | null
          variation_id?: string | null
          week_number: number
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          rutina_id?: string | null
          variation_id?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "rutina_schedule_rutina_id_fkey"
            columns: ["rutina_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rutina_schedule_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "rutina_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      rutina_variations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          rutina_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          rutina_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          rutina_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rutina_variations_rutina_id_fkey"
            columns: ["rutina_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id"]
          },
        ]
      }
      rutinas: {
        Row: {
          created_at: string | null
          frequency: number
          has_variations: boolean
          id: string
          mesociclo_id: string | null
          name: string
          order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          frequency?: number
          has_variations?: boolean
          id?: string
          mesociclo_id?: string | null
          name: string
          order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: number
          has_variations?: boolean
          id?: string
          mesociclo_id?: string | null
          name?: string
          order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rutinas_mesociclo_id_fkey"
            columns: ["mesociclo_id"]
            isOneToOne: false
            referencedRelation: "mesociclos"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercise_logs: {
        Row: {
          created_at: string | null
          ejercicio_id: string | null
          exercise_id: string | null
          id: string
          notas: string | null
          orden: number
          workout_id: string | null
        }
        Insert: {
          created_at?: string | null
          ejercicio_id?: string | null
          exercise_id?: string | null
          id?: string
          notas?: string | null
          orden: number
          workout_id?: string | null
        }
        Update: {
          created_at?: string | null
          ejercicio_id?: string | null
          exercise_id?: string | null
          id?: string
          notas?: string | null
          orden?: number
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "workout_exercise_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          created_at: string | null
          duracion: number | null
          fecha: string | null
          id: string
          mesociclo_id: string | null
          notas: string | null
          rutina_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duracion?: number | null
          fecha?: string | null
          id?: string
          mesociclo_id?: string | null
          notas?: string | null
          rutina_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duracion?: number | null
          fecha?: string | null
          id?: string
          mesociclo_id?: string | null
          notas?: string | null
          rutina_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_mesociclo_id_fkey"
            columns: ["mesociclo_id"]
            isOneToOne: false
            referencedRelation: "mesociclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_rutina_id_fkey"
            columns: ["rutina_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_set_logs: {
        Row: {
          completed: boolean | null
          created_at: string | null
          ejercicio_id: string | null
          exercise_log_id: string | null
          id: string
          peso: number
          repeticiones: number
          rpe: number | null
          set_number: number
          tempo: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          ejercicio_id?: string | null
          exercise_log_id?: string | null
          id?: string
          peso: number
          repeticiones: number
          rpe?: number | null
          set_number: number
          tempo?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          ejercicio_id?: string | null
          exercise_log_id?: string | null
          id?: string
          peso?: number
          repeticiones?: number
          rpe?: number | null
          set_number?: number
          tempo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_set_logs_exercise_log_id_fkey"
            columns: ["exercise_log_id"]
            isOneToOne: false
            referencedRelation: "workout_exercise_logs"
            referencedColumns: ["id"]
          },
        ]
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
