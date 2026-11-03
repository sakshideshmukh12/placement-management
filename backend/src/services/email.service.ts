import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY is missing from environment variables");
}

const brevo = new BrevoClient({ apiKey });

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
): Promise<void> => {
  const senderEmail = process.env.EMAIL_USER;

  if (!senderEmail) {
    throw new Error("EMAIL_USER is missing from environment variables");
  }

  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "PlaceTrack",
      email: senderEmail,
    },
    to: [{ email: to }],
    subject,
    textContent: message,
  });
};