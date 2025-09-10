import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"
import { ENV } from "@/config/env"

export function createClient() {
  return createBrowserClient<Database>(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY,
  )
}
