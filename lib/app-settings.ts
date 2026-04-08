import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const smtpSettingsSchema = z.object({
  host: z.string().trim(),
  port: z.coerce.number().int().positive(),
  user: z.string().trim(),
  pass: z.string().trim(),
  secure: z.boolean(),
});

const fileSettingsSchema = z.object({
  outputDirectory: z.string().trim().min(1),
});

const appSettingsSchema = z.object({
  mail: z.object({
    fromName: z.string().trim().min(1),
    fromAddress: z.string().trim().email(),
    brandLink: z.string().trim().url(),
    adminRecipients: z.array(z.string().trim().email()).min(1),
    transport: z
      .object({
        mode: z.enum(["smtp", "file"]),
        smtp: smtpSettingsSchema,
        file: fileSettingsSchema,
      })
      .superRefine((transport, context) => {
        if (transport.mode === "smtp") {
          if (!transport.smtp.host) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "mail.transport.smtp.host is required when mode is smtp.",
              path: ["smtp", "host"],
            });
          }

          if (!transport.smtp.user) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "mail.transport.smtp.user is required when mode is smtp.",
              path: ["smtp", "user"],
            });
          }

          if (!transport.smtp.pass) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "mail.transport.smtp.pass is required when mode is smtp.",
              path: ["smtp", "pass"],
            });
          }
        }
      }),
  }),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
export type MailSettings = AppSettings["mail"];

let cachedSettings: AppSettings | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeJson(baseValue: unknown, overrideValue: unknown): unknown {
  if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
    return overrideValue;
  }

  if (isRecord(baseValue) && isRecord(overrideValue)) {
    const merged: Record<string, unknown> = { ...baseValue };

    for (const [key, value] of Object.entries(overrideValue)) {
      merged[key] =
        key in baseValue ? mergeJson(baseValue[key], value) : value;
    }

    return merged;
  }

  return overrideValue;
}

function readSettingsFile(filePath: string) {
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function parseBoolean(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function buildEnvironmentOverrides(): Partial<AppSettings> {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpSecure = parseBoolean(process.env.SMTP_SECURE);
  const mailTransportMode = process.env.MAIL_TRANSPORT_MODE?.trim().toLowerCase();
  const mailFromName = process.env.MAIL_FROM_NAME?.trim();
  const mailFromAddress = process.env.MAIL_FROM_ADDRESS?.trim();
  const brandLink = process.env.MAIL_BRAND_LINK?.trim();
  const adminRecipients = process.env.ADMIN_CONTACT_EMAIL?.trim();
  const outputDirectory = process.env.MAIL_FILE_OUTPUT_DIRECTORY?.trim();

  const smtpProvided = Boolean(smtpHost && smtpPort && smtpUser && smtpPass);
  const transportMode =
    mailTransportMode === "smtp" || mailTransportMode === "file"
      ? mailTransportMode
      : undefined;

  const mailOverrides: Record<string, unknown> = {};

  if (transportMode || smtpProvided || outputDirectory) {
    const transportOverrides: Record<string, unknown> = {};

    if (transportMode) {
      transportOverrides.mode = transportMode;
    }

    if (smtpProvided) {
      transportOverrides.smtp = {
        host: smtpHost as string,
        port: Number(smtpPort),
        user: smtpUser as string,
        pass: smtpPass as string,
        secure: smtpSecure ?? false,
      };
    }

    if (outputDirectory) {
      transportOverrides.file = {
        outputDirectory,
      };
    }

    mailOverrides.transport = transportOverrides;
  }

  if (mailFromName) {
    mailOverrides.fromName = mailFromName;
  }

  if (mailFromAddress) {
    mailOverrides.fromAddress = mailFromAddress;
  }

  if (brandLink) {
    mailOverrides.brandLink = brandLink;
  }

  if (adminRecipients) {
    mailOverrides.adminRecipients = [adminRecipients];
  }

  return Object.keys(mailOverrides).length > 0
    ? { mail: mailOverrides as AppSettings["mail"] }
    : {};
}

function getSettingsPaths() {
  return {
    base: resolve(process.cwd(), "appsettings.json"),
    local: resolve(process.cwd(), "appsettings.local.json"),
  };
}

export function getAppSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  const settingsPaths = getSettingsPaths();

  if (!existsSync(settingsPaths.base)) {
    throw new Error(`Missing required settings file: ${settingsPaths.base}`);
  }

  const baseSettings = readSettingsFile(settingsPaths.base);
  const mergedSettings = existsSync(settingsPaths.local)
    ? mergeJson(baseSettings, readSettingsFile(settingsPaths.local))
    : baseSettings;

  const parsedSettings = appSettingsSchema.safeParse(
    mergeJson(mergedSettings, buildEnvironmentOverrides()),
  );

  if (!parsedSettings.success) {
    throw new Error(
      `Invalid app settings in ${settingsPaths.base}: ${parsedSettings.error.message}`,
    );
  }

  cachedSettings = parsedSettings.data;
  return cachedSettings;
}
