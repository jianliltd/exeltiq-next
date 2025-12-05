import { useAuth } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"

export function useSupabase() {
  const { getToken } = useAuth()

  const supabase = createClient(
    // process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    'http://127.0.0.1:54321',
    'public',
    {
      accessToken: async () => getToken() ?? null,
    }
  )

  return supabase
}