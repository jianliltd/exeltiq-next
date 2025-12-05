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

    const { waitlistId, clientId } = await req.json();

    if (!waitlistId || !clientId) {
      throw new Error("Missing required fields");
    }

    // Verify the waitlist entry belongs to this client
    const { data: waitlistEntry, error: verifyError } = await supabaseClient
      .from("gym_waiting_list")
      .select("*")
      .eq("id", waitlistId)
      .eq("client_id", clientId)
      .maybeSingle();

    if (verifyError) {
      console.error("gym-cancel-waitlist: Error verifying entry:", verifyError);
      throw verifyError;
    }

    if (!waitlistEntry) {
      // Check if it was recently promoted to a booking
      const { data: recentBooking } = await supabaseClient
        .from("bookings")
        .select("id")
        .eq("client_id", clientId)
        .eq("is_gym_session", true)
        .gte("created_at", new Date(Date.now() - 60000).toISOString()) // Last minute
        .maybeSingle();

      if (recentBooking) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "You were promoted from the waiting list to a confirmed booking",
            promoted: true,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      console.error("gym-cancel-waitlist: Entry not found and not promoted");
      throw new Error("Waiting list entry not found or already removed");
    }

    // Delete the waiting list entry (trigger will update positions automatically)
    const { error: deleteError } = await supabaseClient
      .from("gym_waiting_list")
      .delete()
      .eq("id", waitlistId);

    if (deleteError) {
      console.error("Error deleting waiting list entry:", deleteError);
      throw deleteError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Removed from waiting list",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in gym-cancel-waitlist:", error);
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

