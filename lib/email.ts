import nodemailer from "nodemailer";
import { contactInterestLabels } from "@/lib/content";
import type { ContactInquiry } from "@/lib/types";

type MailEnvironment = {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
  adminRecipient: string;
  tlsEnabled: boolean;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseBoolean(value: string) {
  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
}

function getMailEnvironment(): MailEnvironment {
  const port = Number.parseInt(requireEnv("SMTP_PORT"), 10);

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  return {
    host: requireEnv("SMTP_HOST"),
    port,
    user: requireEnv("SMTP_USER"),
    pass: requireEnv("SMTP_PASS"),
    fromName: requireEnv("MAIL_FROM_NAME"),
    fromAddress: requireEnv("MAIL_FROM_ADDRESS"),
    adminRecipient: requireEnv("ADMIN_CONTACT_EMAIL"),
    tlsEnabled: parseBoolean(requireEnv("SMTP_SECURE")),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPlainText(inquiry: ContactInquiry) {
  return [
    "New inquiry received from Victoria Falls Discovery Tours",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    `Service interest: ${contactInterestLabels[inquiry.serviceInterest]}`,
    `Travel dates: ${inquiry.travelDates}`,
    `Guest count: ${inquiry.guestCount}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");
}

function buildHtml(inquiry: ContactInquiry) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1d1a16; line-height: 1.6;">
      <h1 style="margin-bottom: 16px;">New inquiry received</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Name</td>
            <td style="padding: 10px 0;">${escapeHtml(inquiry.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Email</td>
            <td style="padding: 10px 0;">${escapeHtml(inquiry.email)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Phone / WhatsApp</td>
            <td style="padding: 10px 0;">${escapeHtml(inquiry.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Service interest</td>
            <td style="padding: 10px 0;">${escapeHtml(
              contactInterestLabels[inquiry.serviceInterest],
            )}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Travel dates</td>
            <td style="padding: 10px 0;">${escapeHtml(inquiry.travelDates)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 700;">Guest count</td>
            <td style="padding: 10px 0;">${inquiry.guestCount}</td>
          </tr>
        </tbody>
      </table>
      <h2 style="margin: 24px 0 10px;">Message</h2>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(inquiry.message)}</p>
    </div>
  `;
}

export async function sendContactInquiryEmail(inquiry: ContactInquiry) {
  const mailEnvironment = getMailEnvironment();
  const useImplicitTls = mailEnvironment.tlsEnabled && mailEnvironment.port === 465;

  const transporter = nodemailer.createTransport({
    host: mailEnvironment.host,
    port: mailEnvironment.port,
    secure: useImplicitTls,
    requireTLS: mailEnvironment.tlsEnabled && !useImplicitTls,
    auth: {
      user: mailEnvironment.user,
      pass: mailEnvironment.pass,
    },
  });

  await transporter.sendMail({
    from: `"${mailEnvironment.fromName}" <${mailEnvironment.fromAddress}>`,
    to: mailEnvironment.adminRecipient,
    replyTo: inquiry.email,
    subject: `New enquiry: ${contactInterestLabels[inquiry.serviceInterest]} - ${inquiry.name}`,
    text: buildPlainText(inquiry),
    html: buildHtml(inquiry),
  });
}
