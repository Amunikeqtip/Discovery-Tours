import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import {
  contactInterestLabels,
  getContactServiceSelectionLabel,
} from "@/lib/content";
import { getAppSettings, type MailSettings } from "@/lib/app-settings";
import type { ContactInquiry } from "@/lib/types";

type MailDeliveryContext = {
  fileOutputDirectory: string | null;
  fromName: string;
  fromAddress: string;
  adminRecipients: string[];
  brandLink: string;
};

function getMailSettings(): MailSettings {
  const appSettings = getAppSettings();
  return {
    ...appSettings.mail,
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
    `Specific request: ${getContactServiceSelectionLabel(
      inquiry.serviceInterest,
      inquiry.serviceSelection,
    )}`,
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
    `Specific request: ${getContactServiceSelectionLabel(
      inquiry.serviceInterest,
      inquiry.serviceSelection,
    )}`,
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
      <td style="padding: 12px 0; font-weight: 700; color: #111827;">Specific request</td>
      <td style="padding: 12px 0; color: #374151;">${escapeHtml(
        getContactServiceSelectionLabel(
          inquiry.serviceInterest,
          inquiry.serviceSelection,
        ),
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

function createMailDeliveryContext(
  mailSettings: MailSettings,
): MailDeliveryContext & { transporter: nodemailer.Transporter } {
  if (mailSettings.transport.mode === "file") {
    return {
      transporter: nodemailer.createTransport({
        streamTransport: true,
        buffer: true,
        newline: "unix",
      }),
      fileOutputDirectory: mailSettings.transport.file.outputDirectory,
      fromName: mailSettings.fromName,
      fromAddress: mailSettings.fromAddress,
      adminRecipients: mailSettings.adminRecipients,
      brandLink: mailSettings.brandLink,
    };
  }

  const { host, port, user, pass, secure } = mailSettings.transport.smtp;
  const useImplicitTls = secure && port === 465;

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: useImplicitTls,
      requireTLS: secure && !useImplicitTls,
      auth: {
        user,
        pass,
      },
    }),
    fileOutputDirectory: null,
    fromName: mailSettings.fromName,
    fromAddress: mailSettings.fromAddress,
    adminRecipients: mailSettings.adminRecipients,
    brandLink: mailSettings.brandLink,
  };
}

function createFileFallbackContext(
  mailSettings: MailSettings,
  outputDirectory = ".mail-drop",
): MailDeliveryContext & { transporter: nodemailer.Transporter } {
  return createMailDeliveryContext({
    ...mailSettings,
    transport: {
      ...mailSettings.transport,
      mode: "file",
      file: {
        outputDirectory,
      },
    },
  });
}

function sanitizeFilePart(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function persistMessagePreview(
  outputDirectory: string,
  kind: "admin" | "guest",
  message: Mail.Options,
  transportResult: { message?: Buffer | string },
) {
  const resolvedDirectory = resolve(process.cwd(), outputDirectory);
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const subjectPart = sanitizeFilePart(message.subject ?? kind) || kind;
  const baseName = `${timestamp}-${kind}-${subjectPart}-${randomUUID().slice(0, 8)}`;

  await mkdir(resolvedDirectory, { recursive: true });

  const rawMessage = transportResult.message
    ? Buffer.isBuffer(transportResult.message)
      ? transportResult.message
      : Buffer.from(transportResult.message)
    : Buffer.from("");

  await writeFile(resolve(resolvedDirectory, `${baseName}.eml`), rawMessage);

  if (typeof message.html === "string") {
    await writeFile(resolve(resolvedDirectory, `${baseName}.html`), message.html);
  }

  await writeFile(
    resolve(resolvedDirectory, `${baseName}.json`),
    JSON.stringify(
      {
        subject: message.subject,
        to: message.to,
        replyTo: message.replyTo,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

async function sendMessage(
  deliveryContext: MailDeliveryContext & { transporter: nodemailer.Transporter },
  kind: "admin" | "guest",
  message: Mail.Options,
) {
  const result = await deliveryContext.transporter.sendMail(message);

  if (deliveryContext.fileOutputDirectory) {
    await persistMessagePreview(
      deliveryContext.fileOutputDirectory,
      kind,
      message,
      result,
    );
  }
}

export async function sendContactInquiryEmail(inquiry: ContactInquiry) {
  const mailSettings = getMailSettings();
  const adminMessage = {
    from: `"${mailSettings.fromName}" <${mailSettings.fromAddress}>`,
    to: mailSettings.adminRecipients.join(", "),
    replyTo: inquiry.email,
    subject: `New enquiry: ${contactInterestLabels[inquiry.serviceInterest]} - ${getContactServiceSelectionLabel(
      inquiry.serviceInterest,
      inquiry.serviceSelection,
    )} - ${inquiry.name}`,
    text: buildAdminPlainText(inquiry),
    html: buildAdminHtml(inquiry, mailSettings.brandLink),
  };
  const guestMessage = {
    from: `"${mailSettings.fromName}" <${mailSettings.fromAddress}>`,
    to: inquiry.email,
    replyTo: mailSettings.adminRecipients[0],
    subject: `We received your Victoria Falls Discovery Tours inquiry`,
    text: buildUserPlainText(inquiry),
    html: buildUserHtml(inquiry, mailSettings.brandLink),
  };

  const deliveryContext = createMailDeliveryContext(mailSettings);

  try {
    await sendMessage(deliveryContext, "admin", adminMessage);

    try {
      await sendMessage(deliveryContext, "guest", guestMessage);
    } catch (error) {
      console.warn("Guest confirmation email could not be sent", error);
    }

    return {
      deliveryMode: deliveryContext.fileOutputDirectory ? ("queued" as const) : ("smtp" as const),
    };
  } catch (error) {
    console.error("SMTP mail delivery failed. Falling back to local queue.", error);

    const fallbackContext = createFileFallbackContext(mailSettings);

    await sendMessage(fallbackContext, "admin", adminMessage);

    try {
      await sendMessage(fallbackContext, "guest", guestMessage);
    } catch (fallbackGuestError) {
      console.warn("Guest confirmation email could not be queued", fallbackGuestError);
    }

    return { deliveryMode: "queued" as const };
  }
}
