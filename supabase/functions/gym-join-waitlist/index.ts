import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { companyId, clientId, scheduleDate, startTime, endTime, scheduleId } = await req.json();

    if (!companyId || !clientId || !scheduleDate || !startTime || !endTime || !scheduleId) {
      throw new Error("Missing required fields");
    }

    // Extract time from ISO string if provided
    const timeMatch = startTime.match(/(\d{2}:\d{2}:\d{2})/);
    const extractedStartTime = timeMatch ? timeMatch[1] : startTime;

    const endTimeMatch = endTime.match(/(\d{2}:\d{2}:\d{2})/);
    const extractedEndTime = endTimeMatch ? endTimeMatch[1] : endTime;

    // Check if client already has a booking for this slot
    const { data: existingBooking, error: bookingCheckError } = await supabaseClient
      .from("bookings")
      .select("id")
      .eq("company_id", companyId)
      .eq("client_id", clientId)
      .eq("schedule_id", scheduleId)
      .eq("schedule_date", scheduleDate)
      .eq("is_gym_session", true)
      .maybeSingle();

    if (bookingCheckError) {
      console.error("Error checking existing booking:", bookingCheckError);
      throw bookingCheckError;
    }

    if (existingBooking) {
      throw new Error("You already have a booking for this time slot");
    }

    // Check if client is already on the waiting list
    const { data: existingWaitlist, error: waitlistCheckError } = await supabaseClient
      .from("gym_waiting_list")
      .select("id, position")
      .eq("company_id", companyId)
      .eq("client_id", clientId)
      .eq("schedule_id", scheduleId)
      .eq("schedule_date", scheduleDate)
      .maybeSingle();

    if (waitlistCheckError) {
      console.error("Error checking waiting list:", waitlistCheckError);
      throw waitlistCheckError;
    }

    if (existingWaitlist) {
      // Already on waiting list, return current position
      return new Response(
        JSON.stringify({
          success: true,
          position: existingWaitlist.position,
          message: "You are already on the waiting list",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get the next position in the waiting list
    const { data: waitlistData, error: countError } = await supabaseClient
      .from("gym_waiting_list")
      .select("position")
      .eq("company_id", companyId)
      .eq("schedule_id", scheduleId)
      .eq("schedule_date", scheduleDate)
      .order("position", { ascending: false })
      .limit(1);

    if (countError) {
      console.error("Error counting waiting list:", countError);
      throw countError;
    }

    const nextPosition = waitlistData && waitlistData.length > 0 ? waitlistData[0].position + 1 : 1;

    // Add to waiting list
    const { data: waitlistEntry, error: insertError } = await supabaseClient
      .from("gym_waiting_list")
      .insert({
        company_id: companyId,
        client_id: clientId,
        schedule_id: scheduleId,
        schedule_date: scheduleDate,
        start_time: extractedStartTime,
        end_time: extractedEndTime,
        position: nextPosition,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting into waiting list:", insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        position: nextPosition,
        waitlistEntry,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in gym-join-waitlist:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

