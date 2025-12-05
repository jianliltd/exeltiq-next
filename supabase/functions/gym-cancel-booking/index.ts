import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CancelBookingRequest = {
  bookingId: string;
  clientId: string;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, clientId }: CancelBookingRequest = await req.json();

    // Only keep error log if needed and remove normal info log
    if (!bookingId || !clientId) {
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

    // Get booking details (including schedule_id)
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*, schedule_date, start_time, end_time, schedule_id, company_id")
      .eq("id", bookingId)
      .eq("client_id", clientId)
      .single();

    if (fetchError || !booking) {
      console.error("gym-cancel-booking: error fetching booking", fetchError);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Calculate if within 2-hour refund window
    const now = new Date();
    const bookingStartTime = new Date(`${booking.schedule_date}T${booking.start_time}`);
    const timeDifference = bookingStartTime.getTime() - now.getTime();
    const hoursUntilBooking = timeDifference / (1000 * 60 * 60);
    const withinRefundWindow = hoursUntilBooking > 2;

    // Get client info
    const { data: client, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("id, sessions_used, sessions_remaining")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      console.error("gym-cancel-booking: error fetching client", clientError);
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ===== STEP 1: Delete the booking =====
    const { error: deleteError } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .eq("client_id", clientId);

    if (deleteError) {
      console.error("gym-cancel-booking: error deleting booking", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to cancel booking" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // ===== STEP 2: Check waiting list and promote first person (ONLY for future bookings) =====
    // Only promote from waitlist if booking is in the future
    const isFutureBooking = bookingStartTime.getTime() > now.getTime();
    
    if (booking.schedule_id && isFutureBooking) {
      // Get schedule capacity
      const { data: schedule, error: scheduleError } = await supabaseAdmin
        .from("gym_schedule_templates")
        .select("max_capacity")
        .eq("id", booking.schedule_id)
        .single();

      if (scheduleError) {
        console.error("gym-cancel-booking: error fetching schedule", scheduleError);
      }

      // Count current bookings for this schedule and date
      const { count: bookingCount, error: countError } = await supabaseAdmin
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("schedule_id", booking.schedule_id)
        .eq("schedule_date", booking.schedule_date)
        .eq("is_gym_session", true)
        .neq("status", "cancelled");

      if (countError) {
        console.error("gym-cancel-booking: error counting bookings", countError);
      }

      // Only promote from waitlist if there's space (booking count < capacity)
      const hasSpace = schedule && schedule.max_capacity && bookingCount !== null && bookingCount < schedule.max_capacity;

      // Find waiting list entries using schedule_id
      const { data: waitlistEntries, error: waitlistError } = await supabaseAdmin
        .from("gym_waiting_list")
        .select("id, client_id, position, schedule_date")
        .eq("schedule_id", booking.schedule_id)
        .eq("schedule_date", booking.schedule_date)
        .order("position", { ascending: true })
        .limit(10);

      if (waitlistError) {
        console.error("gym-cancel-booking: error fetching waiting list", waitlistError);
      }

      if (hasSpace && waitlistEntries && waitlistEntries.length > 0) {
        // Try to promote users from waitlist (skip those with no sessions)
        for (const waitlistEntry of waitlistEntries) {
          // Get the waitlisted client
          const { data: waitlistedClient, error: waitlistedClientError } = await supabaseAdmin
            .from("clients")
            .select("id, name, phone, sessions_remaining, sessions_used")
            .eq("id", waitlistEntry.client_id)
            .single();

          if (waitlistedClientError || !waitlistedClient) {
            console.error("gym-cancel-booking: error fetching waitlisted client", waitlistedClientError);
            continue;
          }

          // Check if client has sessions remaining
          if (waitlistedClient.sessions_remaining <= 0) {
            // Remove from waitlist
            await supabaseAdmin
              .from("gym_waiting_list")
              .delete()
              .eq("id", waitlistEntry.id);

            continue;
          }

          // Create booking for waitlisted client
          const promotedBookingData = {
            company_id: booking.company_id,
            client_id: waitlistedClient.id,
            title: "Gym Session",
            start_time: booking.start_time,
            end_time: booking.end_time,
            schedule_date: booking.schedule_date,
            schedule_id: booking.schedule_id,
            is_gym_session: true,
            status: "scheduled",
          };

          const { error: promotedBookingError } = await supabaseAdmin
            .from("bookings")
            .insert(promotedBookingData);

          if (promotedBookingError) {
            console.error("gym-cancel-booking: error creating booking for promoted client", promotedBookingError);
            continue;
          }

          // Update promoted client's session count
          const { error: updatePromotedError } = await supabaseAdmin
            .from("clients")
            .update({
              sessions_used: waitlistedClient.sessions_used + 1,
              sessions_remaining: waitlistedClient.sessions_remaining - 1,
            })
            .eq("id", waitlistedClient.id);

          if (updatePromotedError) {
            console.error("gym-cancel-booking: error updating promoted client sessions", updatePromotedError);
          }

          // Remove from waiting list
          const { error: removeWaitlistError } = await supabaseAdmin
            .from("gym_waiting_list")
            .delete()
            .eq("id", waitlistEntry.id);

          if (removeWaitlistError) {
            console.error("gym-cancel-booking: error removing from waiting list", removeWaitlistError);
          }

          // Successfully promoted one person, exit loop
          break;
        }
      }
    }

    // ===== STEP 3: Update client's session count if within refund window =====
    let updatedClient = client;

    if (withinRefundWindow) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("clients")
        .update({
          sessions_used: Math.max(0, client.sessions_used - 1),
          sessions_remaining: client.sessions_remaining + 1,
        })
        .eq("id", clientId)
        .select("id, name, phone, sessions_remaining, sessions_used")
        .single();

      if (updateError) {
        console.error("gym-cancel-booking: error updating client sessions", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update sessions" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      updatedClient = updated;
    }

    // Load updated bookings
    const todayDate = new Date().toISOString().split('T')[0];
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select("id, start_time, end_time, schedule_date")
      .eq("client_id", clientId)
      .eq("is_gym_session", true)
      .gte("schedule_date", todayDate)
      .order("schedule_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (bookingsError) {
      console.error("gym-cancel-booking: error fetching bookings", bookingsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        refunded: withinRefundWindow,
        client: updatedClient,
        bookings: bookings || []
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("gym-cancel-booking: unexpected error", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
