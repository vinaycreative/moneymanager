import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const monthsBack = searchParams.get("monthsBack") || "6"

    // Call the database function
    const { data, error } = await supabase.rpc("get_monthly_trend", {
      p_user_id: user.id,
      p_months_back: parseInt(monthsBack),
    })

    if (error) {
      console.error("Monthly trend error:", error)
      return NextResponse.json(
        { error: "Failed to fetch monthly trend" },
        { status: 500 }
      )
    }

    // Return the data or empty array
    const trend = data || []

    return NextResponse.json({ trend })
  } catch (error) {
    console.error("Monthly trend API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 