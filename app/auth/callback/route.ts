import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/dashboard"
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/dashboard"
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        // Create or update user profile directly in the callback
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
        }

        // Check if user profile already exists
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userData.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking existing user:", fetchError)
        }

        if (existingUser) {
          // User exists - only update if there are actual changes
          const needsUpdate =
            existingUser.full_name !== userData.full_name ||
            existingUser.avatar_url !== userData.avatar_url

          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from("users")
              .update({
                full_name: userData.full_name || existingUser.full_name,
                avatar_url: userData.avatar_url || existingUser.avatar_url,
                updated_at: new Date().toISOString(),
              })
              .eq("id", userData.id)

            if (updateError) {
              console.error("Failed to update user profile:", updateError)
            }
          }
        } else {
          // User doesn't exist, create new user profile
          const { error: createError } = await supabase.from("users").insert({
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name || null,
            avatar_url: userData.avatar_url || null,
            currency: "INR",
            timezone: "Asia/Kolkata",
          })

          if (createError) {
            console.error("Failed to create user profile:", createError)
          }
        }

        // Add a small delay to ensure session is properly established
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Simplified redirect logic for production
        const redirectUrl = `${origin}${next}`
        return NextResponse.redirect(redirectUrl)
      } catch (userError) {
        console.error("Failed to create/update user profile:", userError)
        // Even if user profile creation fails, redirect to dashboard
        // The user can still use the app, but some features might be limited

        // Add a small delay to ensure session is properly established
        await new Promise((resolve) => setTimeout(resolve, 100))

        const redirectUrl = `${origin}${next}`
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
