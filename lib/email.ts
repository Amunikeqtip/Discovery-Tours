import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { getGuestBrochureAttachment } from "@/lib/brochure";
import {
  companyProfile,
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

function getBrandHomeUrl(brandLink: string) {
  return brandLink.endsWith("/") ? brandLink.slice(0, -1) : brandLink;
}

function getLogoUrl(brandLink: string) {
  return `${getBrandHomeUrl(brandLink)}${companyProfile.logoPath}`;
}

function buildCompanyDetailsText() {
  return [
    `Company: ${companyProfile.displayName}`,
    `Website: ${companyProfile.website}`,
    `Inquiry email: ${companyProfile.inquiryEmail}`,
    `Phone: ${companyProfile.phoneNumbers.join(" / ")}`,
    `WhatsApp: ${companyProfile.whatsappNumbers.join(" / ")}`,
    `Address: ${companyProfile.address}`,
    `Note: ${companyProfile.bookingNote}`,
  ].join("\n");
}

function buildSuggestedReplyText(inquiry: ContactInquiry) {
  return [
    `Hello ${inquiry.name},`,
    "",
    "Thank you for contacting Victoria Falls Discovery Tours.",
    `We have received your request for ${getContactServiceSelectionLabel(
      inquiry.serviceInterest,
      inquiry.serviceSelection,
    )} under ${contactInterestLabels[inquiry.serviceInterest]}.`,
    `We noted your travel dates as ${inquiry.travelDates} for ${inquiry.guestCount} guest(s).`,
    "",
    "We are reviewing the best available options and will share the most suitable next steps, pricing guidance, and availability details shortly.",
    "",
    "If you would like us to tailor the reply further, please let us know your comfort level, preferred timing, or any special requirements.",
    "",
    "Kind regards,",
    companyProfile.displayName,
  ].join("\n");
}

function buildReplyDraftSubject(inquiry: ContactInquiry) {
  return `Re: Your ${contactInterestLabels[inquiry.serviceInterest]} inquiry with ${companyProfile.displayName}`;
}

function buildReplyWithTemplateLink(inquiry: ContactInquiry) {
  const searchParams = new URLSearchParams({
    subject: buildReplyDraftSubject(inquiry),
    body: buildSuggestedReplyText(inquiry),
  });

  return `mailto:${encodeURIComponent(inquiry.email)}?${searchParams.toString()}`;
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
    "",
    "Reply workflow:",
    "Use Reply in your email client to answer the guest directly.",
    `Reply with template: ${buildReplyWithTemplateLink(inquiry)}`,
    "",
    "Suggested reply template:",
    buildSuggestedReplyText(inquiry),
    "",
    buildCompanyDetailsText(),
  ].join("\n");
}

function buildUserPlainText(inquiry: ContactInquiry) {
  return [
    `Hello ${inquiry.name},`,
    "",
    `Thank you for contacting ${companyProfile.displayName}.`,
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
    "A brochure with our current categories and products is attached for easy reference.",
    "",
    buildCompanyDetailsText(),
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

function buildBrandHeaderHtml({
  brandLink,
  eyebrow,
  title,
  description,
  variant,
}: {
  brandLink: string;
  eyebrow: string;
  title: string;
  description: string;
  variant: "admin" | "guest";
}) {
  const isAdmin = variant === "admin";
  const wrapperStyle = isAdmin
    ? "padding: 24px 32px 18px; background: linear-gradient(135deg, #111111 0%, #1d1a16 55%, #0ea5d9 100%); color: #ffffff;"
    : "padding: 24px 32px 22px; background: linear-gradient(135deg, #fffaf0 0%, #f9efe0 52%, #dff4ff 100%); color: #111827; border-bottom: 1px solid #e7dfcf;";
  const eyebrowColor = isAdmin ? "rgba(255,255,255,0.82)" : "#0b6a8f";
  const descriptionColor = isAdmin ? "rgba(255,255,255,0.82)" : "#475569";
  const logoMarginBottom = isAdmin ? "10px" : "14px";

  return `
    <div style="${wrapperStyle}">
      <img
        src="${escapeHtml(getLogoUrl(brandLink))}"
        alt="${escapeHtml(companyProfile.displayName)} logo"
        width="180"
        style="display: block; width: 180px; max-width: 100%; height: auto; margin-bottom: ${logoMarginBottom};"
      />
      <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: ${eyebrowColor};">${escapeHtml(eyebrow)}</p>
      <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">${escapeHtml(title)}</h1>
      <p style="margin: 8px 0 0; max-width: 560px; color: ${descriptionColor};">
        ${escapeHtml(description)}
      </p>
    </div>
  `;
}

function buildCompanyFooterHtml(brandLink: string) {
  return `
    <div style="padding: 22px 32px 28px; border-top: 1px solid #ece6d8; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 8px; color: #111827; font-weight: 700;">${escapeHtml(companyProfile.displayName)}</p>
      <p style="margin: 0 0 6px;">${escapeHtml(companyProfile.tagline)}</p>
      <p style="margin: 0 0 6px;">Website: <a href="${escapeHtml(companyProfile.website)}" style="color: #0ea5d9; text-decoration: none;">${escapeHtml(companyProfile.website)}</a></p>
      <p style="margin: 0 0 6px;">Inquiry email: ${escapeHtml(companyProfile.inquiryEmail)}</p>
      <p style="margin: 0 0 6px;">Phone: ${escapeHtml(companyProfile.phoneNumbers.join(" / "))}</p>
      <p style="margin: 0 0 6px;">WhatsApp: ${escapeHtml(companyProfile.whatsappNumbers.join(" / "))}</p>
      <p style="margin: 0 0 10px;">Address: ${escapeHtml(companyProfile.address)}</p>
      <p style="margin: 0 0 10px;">${escapeHtml(companyProfile.bookingNote)}</p>
      <p style="margin: 0;"><a href="${escapeHtml(brandLink)}" style="color: #0ea5d9; text-decoration: none;">Open website</a></p>
    </div>
  `;
}

function buildInfoPanelHtml(title: string, body: string) {
  return `
    <div style="margin-bottom: 24px; padding: 18px 20px; border-radius: 18px; background: #f8fafc; border: 1px solid #dbe4ef;">
      <strong style="display: block; margin-bottom: 6px; color: #0f172a;">${escapeHtml(title)}</strong>
      <span style="color: #475569;">${escapeHtml(body)}</span>
    </div>
  `;
}

function buildReplyActionHtml(inquiry: ContactInquiry) {
  return `
    <div style="margin-top: 16px;">
      <a
        href="${escapeHtml(buildReplyWithTemplateLink(inquiry))}"
        style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #0ea5d9; color: #ffffff; text-decoration: none; font-weight: 700;"
      >
        Reply with template
      </a>
      <p style="margin: 10px 0 0; color: #475569;">
        This opens a draft addressed to ${escapeHtml(inquiry.email)} with the template prefilled so the admin team can edit before sending.
      </p>
    </div>
  `;
}

function buildMessageCardHtml(label: string, message: string) {
  return `
    <div style="margin-top: 28px; padding: 24px; border-radius: 20px; background: #fcfbf8; border: 1px solid #e7dfcf;">
      <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #0ea5d9;">${escapeHtml(label)}</p>
      <p style="margin: 0; white-space: pre-wrap; color: #374151;">${escapeHtml(message)}</p>
    </div>
  `;
}

function buildSuggestedReplyHtml(inquiry: ContactInquiry) {
  return `
    <div style="margin-top: 28px; padding: 24px; border-radius: 20px; background: #f0f9ff; border: 1px solid #bae6fd;">
      <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #0369a1;">Suggested reply</p>
      <p style="margin: 0 0 12px; color: #0f172a; font-weight: 700;">Use Reply in your email client to answer ${escapeHtml(inquiry.name)} directly.</p>
      <p style="margin: 0; white-space: pre-wrap; color: #334155;">${escapeHtml(buildSuggestedReplyText(inquiry))}</p>
    </div>
  `;
}

function wrapMessageContent({
  brandLink,
  eyebrow,
  title,
  description,
  body,
  variant,
}: {
  brandLink: string;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  variant: "admin" | "guest";
}) {
  const bodyPadding = variant === "admin" ? "24px 32px 32px" : "32px";

  return `
    <div style="margin: 0; padding: 32px 16px; background: #f5f1e8; font-family: Arial, sans-serif; color: #111827; line-height: 1.7;">
      <div style="max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #d9d3c4; border-radius: 24px; overflow: hidden;">
        ${buildBrandHeaderHtml({ brandLink, eyebrow, title, description, variant })}
        <div style="padding: ${bodyPadding};">
          ${body}
        </div>
        ${buildCompanyFooterHtml(brandLink)}
      </div>
    </div>
  `;
}

function buildAdminHtml(inquiry: ContactInquiry, brandLink: string) {
  return wrapMessageContent({
    brandLink,
    eyebrow: "Admin Inquiry Alert",
    title: "A new inquiry has been submitted",
    description:
      "A guest has requested more information from Victoria Falls Discovery Tours. Review the details below, then use Reply to answer the guest directly with the prepared template.",
    variant: "admin",
    body: `
      ${buildInfoPanelHtml(
        "Quick action",
        `Reply to ${inquiry.email} or contact the guest via ${inquiry.phone}.`,
      )}
      ${buildReplyActionHtml(inquiry)}
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${buildSummaryRows(inquiry)}
        </tbody>
      </table>
      ${buildMessageCardHtml("Guest message", inquiry.message)}
      ${buildSuggestedReplyHtml(inquiry)}
    `,
  });
}

function buildUserHtml(inquiry: ContactInquiry, brandLink: string) {
  return wrapMessageContent({
    brandLink,
    eyebrow: "Inquiry Received",
    title: `Thank you for reaching out, ${inquiry.name}`,
    description:
      "Your inquiry has been received by Victoria Falls Discovery Tours. Our team will review your request and reply with the most suitable next steps.",
    variant: "guest",
    body: `
      ${buildInfoPanelHtml(
        "What happens next",
        "An admin will review your requested service, dates, and group size, then follow up by email or WhatsApp. A brochure is attached for quick reference while you wait.",
      )}
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${buildSummaryRows(inquiry)}
        </tbody>
      </table>
      ${buildMessageCardHtml("Your message", inquiry.message)}
    `,
  });
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

async function getAttachmentBuffer(attachment: Mail.Attachment) {
  if (Buffer.isBuffer(attachment.content)) {
    return attachment.content;
  }

  if (typeof attachment.content === "string") {
    return Buffer.from(attachment.content);
  }

  if (typeof attachment.path === "string") {
    return readFile(attachment.path);
  }

  return null;
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

  const attachmentSummaries = await Promise.all(
    (message.attachments ?? []).map(async (attachment, index) => {
      const attachmentBuffer = await getAttachmentBuffer(attachment);
      const originalName =
        typeof attachment.filename === "string" && attachment.filename
          ? attachment.filename
          : `${kind}-attachment-${index + 1}`;
      const fileExtension = extname(originalName) || ".bin";
      const safeName =
        sanitizeFilePart(originalName.replace(fileExtension, "")) ||
        `${kind}-attachment-${index + 1}`;
      const savedFileName = `${baseName}-${String(index + 1).padStart(2, "0")}-${safeName}${fileExtension}`;

      if (attachmentBuffer) {
        await writeFile(resolve(resolvedDirectory, savedFileName), attachmentBuffer);
      }

      return {
        filename: originalName,
        contentType: attachment.contentType ?? null,
        savedAs: attachmentBuffer ? savedFileName : null,
      };
    }),
  );

  await writeFile(
    resolve(resolvedDirectory, `${baseName}.json`),
    JSON.stringify(
      {
        subject: message.subject,
        to: message.to,
        replyTo: message.replyTo,
        generatedAt: new Date().toISOString(),
        attachments: attachmentSummaries,
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
  const brochureAttachment = await getGuestBrochureAttachment();

  const adminMessage: Mail.Options = {
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

  const guestMessage: Mail.Options = {
    from: `"${mailSettings.fromName}" <${mailSettings.fromAddress}>`,
    to: inquiry.email,
    replyTo: mailSettings.adminRecipients[0],
    subject: `We received your Victoria Falls Discovery Tours inquiry`,
    text: buildUserPlainText(inquiry),
    html: buildUserHtml(inquiry, mailSettings.brandLink),
    attachments: [
      {
        filename: brochureAttachment.filename,
        contentType: brochureAttachment.contentType,
        content: brochureAttachment.content,
      },
    ],
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
