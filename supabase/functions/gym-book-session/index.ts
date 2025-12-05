import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type BookSessionRequest = {
  companyId: string;
  clientId: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleId: string;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, clientId, scheduleDate, startTime, endTime, scheduleId }: BookSessionRequest = await req.json();

    if (!companyId || !clientId || !scheduleDate || !startTime || !endTime || !scheduleId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get current client data
    const { data: client, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("id, sessions_used, sessions_remaining")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      console.error("gym-book-session: error fetching client", clientError);
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if client has sessions remaining
    if (client.sessions_remaining <= 0) {
      return new Response(
        JSON.stringify({ error: "No sessions remaining" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Combine date and time into full datetime strings
    const startDateTime = `${scheduleDate}T${startTime}`;
    const endDateTime = `${scheduleDate}T${endTime}`;

    // Validate that the booking is for a future time
    const now = new Date();
    const bookingStartTime = new Date(startDateTime);
    if (bookingStartTime <= now) {
      return new Response(
        JSON.stringify({ error: "Cannot book past slots" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if client already has a booking for this slot
    const { data: existingBooking } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("company_id", companyId)
      .eq("client_id", clientId)
      .eq("is_gym_session", true)
      .eq("schedule_id", scheduleId)
      .eq("schedule_date", scheduleDate)
      .maybeSingle();

    if (existingBooking) {
      return new Response(
        JSON.stringify({ error: "You already have a booking for this time slot" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get schedule template to check max_capacity
    const { data: scheduleTemplate, error: scheduleError } = await supabaseAdmin
      .from("gym_schedule_templates")
      .select("id, max_capacity")
      .eq("id", scheduleId)
      .maybeSingle();

    if (scheduleError || !scheduleTemplate) {
      return new Response(
        JSON.stringify({ error: "Schedule not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check current booking count for this slot
    const { data: currentBookings, error: countError } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("company_id", companyId)
      .eq("is_gym_session", true)
      .eq("schedule_id", scheduleId)
      .eq("schedule_date", scheduleDate);

    if (countError) {
      console.error("gym-book-session: error counting bookings", countError);
      return new Response(
        JSON.stringify({ error: "Failed to check availability" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const currentCount = currentBookings?.length || 0;

    // Check if schedule is full
    if (currentCount >= scheduleTemplate.max_capacity) {
      return new Response(
        JSON.stringify({ 
          error: "This time slot is full", 
          isFull: true,
          capacity: scheduleTemplate.max_capacity,
          currentBookings: currentCount
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create booking
    const bookingData = {
      company_id: companyId,
      client_id: clientId,
      title: "Gym Session",
      start_time: startTime,
      end_time: endTime,
      schedule_date: scheduleDate,
      schedule_id: scheduleId,
      is_gym_session: true,
      status: "scheduled",
    };

    const { error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert(bookingData);

    if (bookingError) {
      console.error("gym-book-session: error creating booking", bookingError);
      return new Response(
        JSON.stringify({ error: "Failed to create booking" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update client sessions
    const { data: updatedClient, error: updateError } = await supabaseAdmin
      .from("clients")
      .update({
        sessions_used: client.sessions_used + 1,
        sessions_remaining: client.sessions_remaining - 1,
      })
      .eq("id", clientId)
      .select("id, name, phone, sessions_remaining, sessions_used")
      .single();

    if (updateError) {
      console.error("gym-book-session: error updating client sessions", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update sessions" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Load updated bookings (filter by schedule_date since start_time is time-only)
    const todayDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select("id, start_time, end_time, schedule_date")
      .eq("client_id", clientId)
      .eq("is_gym_session", true)
      .gte("schedule_date", todayDate)
      .order("schedule_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (bookingsError) {
      console.error("gym-book-session: error fetching bookings", bookingsError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        client: updatedClient,
        bookings: bookings || []
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("gym-book-session: unexpected error", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

