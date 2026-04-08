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
  adminRecipients: string[];
  tlsEnabled: boolean;
  brandLink: string;
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

function parseRecipientList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireAdminRecipients() {
  const listValue =
    process.env.ADMIN_CONTACT_EMAILS ?? process.env.ADMIN_CONTACT_EMAIL;

  if (!listValue) {
    throw new Error(
      "Missing required environment variable: ADMIN_CONTACT_EMAILS or ADMIN_CONTACT_EMAIL",
    );
  }

  const recipients = parseRecipientList(listValue);

  if (!recipients.length) {
    throw new Error("At least one admin recipient email address is required.");
  }

  return recipients;
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
    adminRecipients: requireAdminRecipients(),
    tlsEnabled: parseBoolean(requireEnv("SMTP_SECURE")),
    brandLink: process.env.MAIL_BRAND_LINK ?? "https://seventeencatering.com/#",
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

function buildAdminPlainText(inquiry: ContactInquiry) {
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

function buildUserPlainText(inquiry: ContactInquiry) {
  return [
    `Hello ${inquiry.name},`,
    "",
    "Thank you for contacting Victoria Falls Discovery Tours.",
    "Your inquiry has been received and our team will review it shortly.",
    "",
    "Inquiry summary",
    `Service interest: ${contactInterestLabels[inquiry.serviceInterest]}`,
    `Travel dates: ${inquiry.travelDates}`,
    `Guest count: ${inquiry.guestCount}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    "",
    "Your message:",
    inquiry.message,
    "",
    "We will get back to you as soon as possible.",
    "",
    "Victoria Falls Discovery Tours",
  ].join("\n");
}

function buildSummaryRows(inquiry: ContactInquiry) {
  return `
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Guest name</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(inquiry.name)}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Email</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(inquiry.email)}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Phone / WhatsApp</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(inquiry.phone)}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Service interest</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(
        contactInterestLabels[inquiry.serviceInterest],
      )}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Travel dates</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(inquiry.travelDates)}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Guest count</td>
      <td style="padding: 12px 0; color: #374151;">${inquiry.guestCount}</td>
    </tr>
  `;
}

function buildAdminHtml(inquiry: ContactInquiry, brandLink: string) {
  return `
    <div style="margin: 0; padding: 32px 16px; background: #f5f1e8; font-family: Arial, sans-serif; color: #111827; line-height: 1.7;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #d9d3c4; border-radius: 24px; overflow: hidden;">
        <div style="padding: 28px 32px; background: linear-gradient(135deg, #111111 0%, #1d1a16 55%, #0ea5d9 100%); color: #ffffff;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.78;">Admin Inquiry Alert</p>
          <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">A new inquiry has been submitted</h1>
          <p style="margin: 12px 0 0; max-width: 540px; color: rgba(255,255,255,0.82);">
            A guest has requested more information from Victoria Falls Discovery Tours. Review the full details below and respond directly to continue the conversation.
          </p>
        </div>
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px; padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #dbe4ef;">
            <strong style="display: block; margin-bottom: 6px; color: #0f172a;">Quick action</strong>
            <span style="color: #475569;">Reply to ${escapeHtml(inquiry.email)} or contact the guest via ${escapeHtml(inquiry.phone)}.</span>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${buildSummaryRows(inquiry)}
            </tbody>
          </table>
          <div style="margin-top: 28px; padding: 24px; border-radius: 20px; background: #fcfbf8; border: 1px solid #e7dfcf;">
            <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #0ea5d9;">Guest message</p>
            <p style="margin: 0; white-space: pre-wrap; color: #374151;">${escapeHtml(inquiry.message)}</p>
          </div>
        </div>
        <div style="padding: 20px 32px 28px; border-top: 1px solid #ece6d8; color: #6b7280; font-size: 14px;">
          <p style="margin: 0 0 8px;">Victoria Falls Discovery Tours automated inquiry desk</p>
          <p style="margin: 0;"><a href="${escapeHtml(brandLink)}" style="color: #0ea5d9; text-decoration: none;">Open reference link</a></p>
        </div>
      </div>
    </div>
  `;
}

function buildUserHtml(inquiry: ContactInquiry, brandLink: string) {
  return `
    <div style="margin: 0; padding: 32px 16px; background: #f5f1e8; font-family: Arial, sans-serif; color: #111827; line-height: 1.7;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #d9d3c4; border-radius: 24px; overflow: hidden;">
        <div style="padding: 28px 32px; background: linear-gradient(135deg, #111111 0%, #1d1a16 55%, #0ea5d9 100%); color: #ffffff;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.78;">Inquiry Received</p>
          <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">Thank you for reaching out, ${escapeHtml(inquiry.name)}</h1>
          <p style="margin: 12px 0 0; max-width: 560px; color: rgba(255,255,255,0.82);">
            Your inquiry has been received by Victoria Falls Discovery Tours. Our team will review your request and respond with the most suitable next steps.
          </p>
        </div>
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px; padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #dbe4ef;">
            <strong style="display: block; margin-bottom: 6px; color: #0f172a;">What happens next</strong>
            <span style="color: #475569;">An admin will review your requested service, dates, and group size, then follow up by email or WhatsApp.</span>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${buildSummaryRows(inquiry)}
            </tbody>
          </table>
          <div style="margin-top: 28px; padding: 24px; border-radius: 20px; background: #fcfbf8; border: 1px solid #e7dfcf;">
            <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #0ea5d9;">Your message</p>
            <p style="margin: 0; white-space: pre-wrap; color: #374151;">${escapeHtml(inquiry.message)}</p>
          </div>
          <div style="margin-top: 28px;">
            <a href="${escapeHtml(brandLink)}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #0ea5d9; color: #ffffff; text-decoration: none; font-weight: 700;">
              Visit Victoria Falls Discovery Tours
            </a>
          </div>
        </div>
        <div style="padding: 20px 32px 28px; border-top: 1px solid #ece6d8; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">This confirmation was sent automatically after your inquiry submission.</p>
        </div>
      </div>
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
    to: mailEnvironment.adminRecipients.join(", "),
    replyTo: inquiry.email,
    subject: `New enquiry: ${contactInterestLabels[inquiry.serviceInterest]} - ${inquiry.name}`,
    text: buildAdminPlainText(inquiry),
    html: buildAdminHtml(inquiry, mailEnvironment.brandLink),
  });

  await transporter.sendMail({
    from: `"${mailEnvironment.fromName}" <${mailEnvironment.fromAddress}>`,
    to: inquiry.email,
    replyTo: mailEnvironment.adminRecipients[0],
    subject: `We received your Victoria Falls Discovery Tours inquiry`,
    text: buildUserPlainText(inquiry),
    html: buildUserHtml(inquiry, mailEnvironment.brandLink),
  });
}
