import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>', // fallback
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to", to, "Status:", data.data?.id || "OK");
    return data;
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Email sending failed");
  }
};