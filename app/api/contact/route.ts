import { NextResponse } from "next/server";
import { contactInquirySchema } from "@/lib/contact-schema";
import { sendContactInquiryEmail } from "@/lib/email";

function flattenFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, messages]) => messages && messages.length > 0)
      .map(([field, messages]) => [field, messages?.[0] ?? "Invalid value"]),
  );
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please review the highlighted fields and try again.",
        fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  try {
    await sendContactInquiryEmail(parsed.data);

    return NextResponse.json({
      message:
        "Your inquiry has been sent successfully. The admin team can now review your request.",
    });
  } catch (error) {
    console.error("Failed to send contact inquiry email", error);

    return NextResponse.json(
      {
        message:
          "We could not send your inquiry right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
