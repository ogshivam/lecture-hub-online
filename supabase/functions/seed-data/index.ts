
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if caller is admin
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sample data
    const sampleCourses = [
      {
        name: "JEE Chemistry",
        description: "Comprehensive course covering all chemistry topics for JEE preparation."
      },
      {
        name: "NEET Biology",
        description: "Complete biology preparation for NEET aspirants with detailed explanations."
      }
    ];

    // Insert courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .insert(sampleCourses)
      .select();

    if (coursesError) {
      return new Response(
        JSON.stringify({ error: "Failed to insert courses" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sample weeks
    const sampleWeeks = [
      {
        name: "Week 1",
        course_id: courses[0].id
      },
      {
        name: "Week 2",
        course_id: courses[0].id
      },
      {
        name: "Week 1",
        course_id: courses[1].id
      },
      {
        name: "Week 2",
        course_id: courses[1].id
      }
    ];

    // Insert weeks
    const { data: weeks, error: weeksError } = await supabase
      .from('weeks')
      .insert(sampleWeeks)
      .select();

    if (weeksError) {
      return new Response(
        JSON.stringify({ error: "Failed to insert weeks" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sample lectures
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const sampleLectures = [
      {
        course_id: courses[0].id,
        week_id: weeks[0].id,
        title: "Atomic Structure - Basics",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: tomorrow.toISOString(),
        description: "Introduction to atomic structure and basic principles of chemistry."
      },
      {
        course_id: courses[0].id,
        week_id: weeks[0].id,
        title: "Chemical Bonding",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: dayAfterTomorrow.toISOString(),
        description: "Understanding different types of chemical bonds and their properties."
      },
      {
        course_id: courses[0].id,
        week_id: weeks[1].id,
        title: "Thermodynamics Part 1",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: twoDaysAgo.toISOString(),
        description: "First laws of thermodynamics and their applications."
      },
      {
        course_id: courses[1].id,
        week_id: weeks[2].id,
        title: "Cell Structure & Functions",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: tenMinutesFromNow.toISOString(),
        description: "Detailed explanation of cell organelles and their functions."
      },
      {
        course_id: courses[1].id,
        week_id: weeks[2].id,
        title: "Plant Physiology",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: thirtyMinutesAgo.toISOString(),
        description: "Understanding plant growth, development and physiological processes."
      },
      {
        course_id: courses[1].id,
        week_id: weeks[3].id,
        title: "Human Anatomy Basics",
        youtube_id: "dQw4w9WgXcQ",
        scheduled_time: threeDaysFromNow.toISOString(),
        description: "Introduction to major organ systems in the human body."
      }
    ];

    // Insert lectures
    const { data: lectures, error: lecturesError } = await supabase
      .from('lectures')
      .insert(sampleLectures)
      .select();

    if (lecturesError) {
      return new Response(
        JSON.stringify({ error: "Failed to insert lectures" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Sample data seeded successfully",
        data: { courses, weeks, lectures }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in seed-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
