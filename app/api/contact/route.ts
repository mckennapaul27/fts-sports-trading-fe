import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const { name, email, subject, message } = validatedData;

    // Send notification email to support
    const supportEmailResult = await resend.emails.send({
      from: "Fortis Sports Trading <noreply@fortissportstrading.com>",
      to: "support@fortissportstrading.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (supportEmailResult.error) {
      console.error("Error sending support email:", supportEmailResult.error);
      throw new Error("Failed to send notification email");
    }

    // Send acknowledgement email to enquirer
    const acknowledgementEmailResult = await resend.emails.send({
      from: "Fortis Sports Trading <noreply@fortissportstrading.com>",
      to: email,
      subject: "We've received your message",
      html: `
        <h2>Thank you for contacting Fortis Sports Trading</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within one working day.</p>
        <p><strong>Your message:</strong></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p>Best regards,<br>The Fortis Sports Trading Team</p>
      `,
    });

    if (acknowledgementEmailResult.error) {
      console.error(
        "Error sending acknowledgement email:",
        acknowledgementEmailResult.error
      );
      // Don't fail the request if acknowledgement email fails
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
