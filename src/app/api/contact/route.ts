import { NextRequest, NextResponse } from "next/server";
import { addContactSubmission } from "@/lib/content";
import { isFeatureEnabled } from "@/lib/feature-flags";

export async function POST(request: NextRequest) {
  if (!(await isFeatureEnabled("marketing_contact_form"))) {
    return NextResponse.json(
      { error: "Contact form is temporarily disabled." },
      { status: 503 },
    );
  }
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    await addContactSubmission({ name, email, company, message });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact submission error:", e);
    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again or email us at contact@torqstudio.com.",
      },
      { status: 500 }
    );
  }
}
