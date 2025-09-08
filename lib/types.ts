export interface Driver {
  id: string
  user_id: string
  name: string
  number: number
  team?: string
  nationality?: string
  points: number
  wins: number
  podiums: number
  fastest_laps: number
  created_at: string
  updated_at: string
}

export interface Race {
  id: string
  user_id: string
  name: string
  circuit: string
  date: string
  status: "upcoming" | "practice" | "qualifying" | "race" | "completed"
  weather?: string
  temperature?: number
  created_at: string
  updated_at: string
}

export interface RaceResult {
  id: string
  user_id: string
  race_id: string
  driver_id: string
  position: number
  points: number
  fastest_lap: boolean
  dnf: boolean
  dnf_reason?: string
  lap_time?: string
  created_at: string
}

export interface TimingData {
  id: string
  user_id: string
  race_id: string
  driver_id: string
  sector: 1 | 2 | 3
  microsector: number
  time_ms: number
  session_type: "practice" | "qualifying" | "race"
  created_at: string
}

export interface CarPart {
  id: string
  user_id: string
  name: string
  category: "engine" | "aerodynamics" | "suspension" | "brakes" | "electronics" | "tires"
  condition: number
  wear_rate: number
  performance_impact: number
  cost: number
  created_at: string
  updated_at: string
}

export interface TestConfiguration {
  id: string
  user_id: string
  name: string
  circuit: string
  weather_conditions?: string
  temperature?: number
  setup_data?: Record<string, any>
  notes?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content?: string
  category: "general" | "setup" | "strategy" | "driver" | "technical"
  race_id?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  team_name?: string
  created_at: string
  updated_at: string
}
