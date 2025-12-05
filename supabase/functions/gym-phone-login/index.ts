import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type LoginRequest = {
  companyId: string;
  phone: string;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, phone }: LoginRequest = await req.json();

    if (!companyId || !phone) {
      return new Response(
        JSON.stringify({ error: "companyId and phone are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const normalized = phone.replace(/\D/g, "");

    // Fetch clients for the company and match by normalized phone
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from("clients")
      .select("id, name, phone, sessions_remaining, sessions_used")
      .eq("company_id", companyId);

    if (clientsError) {
      console.error("gym-phone-login: error fetching clients", clientsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch clients" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const client = (clients || []).find((c: any) => (c.phone ? String(c.phone).replace(/\D/g, "") : "") === normalized);

    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Load upcoming bookings (filter by schedule_date since start_time is time-only)
    const todayDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select("id, start_time, end_time, schedule_date")
      .eq("client_id", client.id)
      .eq("is_gym_session", true)
      .gte("schedule_date", todayDate)
      .order("schedule_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (bookingsError) {
      console.error("gym-phone-login: error fetching bookings", bookingsError);
    }

    return new Response(
      JSON.stringify({ client, bookings: bookings || [] }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("gym-phone-login: unexpected error", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
