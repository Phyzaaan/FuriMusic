import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeName } from "@/app/utils/data/data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { captchaToken, name, extension } = await req.json();

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Missing CAPTCHA token" },
        { status: 400 }
      );
    }

    // Verify Turnstile
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: captchaToken,
        }),
      }
    );

    const result = await verify.json();

    if (!result.success) {
      return NextResponse.json(
        { error: "CAPTCHA failed" },
        { status: 403 }
      );
    }

    // Generate filename
    const fileName = `${sanitizeName(name)}.${extension ?? "mp3"}`;

    // Create signed upload URL
    const { data, error } = await supabase.storage
      .from("songs")
      .createSignedUploadUrl(fileName);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token: data.token,
      path: data.path,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}