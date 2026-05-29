import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const resend = new Resend(process.env.RESEND_API_KEY!);
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
          <div style="background:#F8F6F2;padding:48px 20px;">
    <div style="max-width:520px;margin:0 auto;background:#FCFBF8;border:1px solid #E7E1D8;border-radius:24px;padding:48px 40px;color:#1C1A18;box-shadow:0 4px 24px rgba(28,26,24,0.04);">

    <!-- Brand -->
    <div style="margin-bottom:40px;">
      <p style="
        margin:0;
        font-family:'DM Sans',Arial,sans-serif;
        font-size:10px;
        letter-spacing:0.28em;
        text-transform:uppercase;
        color:#8A847D;
      ">
        Olfaire
      </p>
    </div>

    <!-- Heading -->
    <h1 style="
      margin:0 0 18px;
      font-family:'Cormorant Garamond',Georgia,serif;
      font-size:40px;
      line-height:1.05;
      font-weight:400;
      letter-spacing:-0.02em;
      color:#1C1A18;
    ">
      You're on the list.
    </h1>

    <!-- Intro -->
    <p style="
      margin:0 0 28px;
      font-family:'Cormorant Garamond',Georgia,serif;
      font-size:22px;
      line-height:1.55;
      font-style:italic;
      font-weight:300;
      color:#3A342E;
    ">
      “Something refined is taking shape.
      <br />
      You'll hear from me when it’s ready.”
    </p>

    <!-- Signature -->
    <div style="margin-bottom:36px;">
      <p style="
        margin:0;
        font-family:'DM Sans',Arial,sans-serif;
        font-size:13px;
        color:#8A847D;
        letter-spacing:0.04em;
      ">
        — Lumi
      </p>
    </div>

    <!-- Divider -->
    <div style="
      height:1px;
      background:linear-gradient(to right, transparent, #D8D1C7, transparent);
      margin:36px 0;
    "></div>

    <!-- Footer -->
    <p style="
      margin:0 0 18px;
      font-family:'DM Sans',Arial,sans-serif;
      font-size:13px;
      line-height:1.8;
      color:#6E6861;
    ">
      You'll receive early access and launch pricing when Olfaire is live.
    </p>

    <!-- CTA -->
    <a
      href="https://olfaire.app"
      style="
        display:inline-block;
        padding:12px 22px;
        border:1px solid #C7A56A;
        border-radius:999px;
        text-decoration:none;
        font-family:'DM Sans',Arial,sans-serif;
        font-size:12px;
        letter-spacing:0.08em;
        text-transform:uppercase;
        color:#9C6C1E;
        background:#FFFDFC;
      "
    >
      Visit olfaire.app
    </a>

  </div>
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
