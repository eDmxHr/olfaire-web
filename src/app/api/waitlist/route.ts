import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY!);
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // Save to Supabase waitlist table
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email, source: "landing_page" });

    // If duplicate email, still return success — don't expose that email exists
    if (dbError && dbError.code !== "23505") {
      console.error("Waitlist DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to join waitlist." },
        { status: 500 },
      );
    }

    // Send confirmation email via Resend
    if (!dbError) {
      await resend.emails.send({
        from: "Lumi at Olfaire <lumi@olfaire.app>",
        to: email,
        subject: "You're on the Olfaire waitlist",
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1C1A18; background: #FAF9F6;">
            <div style="margin-bottom: 32px;">
              <p style="font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #8C8680; font-family: sans-serif;">Olfaire</p>
            </div>
            <h1 style="font-size: 28px; font-weight: 300; line-height: 1.3; margin-bottom: 16px;">
              You're on the list.
            </h1>
            <p style="font-size: 16px; font-style: italic; font-weight: 300; line-height: 1.65; color: #1C1A18; margin-bottom: 24px;">
              "Something refined is being built. You'll hear from me when it's ready."
            </p>
            <p style="font-size: 13px; color: #8C8680; line-height: 1.6; font-family: sans-serif;">
              — Lumi
            </p>
            <hr style="border: none; border-top: 1px solid #D4CFC8; margin: 32px 0;" />
            <p style="font-size: 11px; color: #8C8680; font-family: sans-serif;">
              You'll receive early access and launch pricing when Olfaire is live.
              <br />
              <a href="https://olfaire.app" style="color: #B07D2A;">olfaire.app</a>
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
