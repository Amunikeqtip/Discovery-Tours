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

  const parsedSettings = appSettingsSchema.safeParse(mergedSettings);

  if (!parsedSettings.success) {
    throw new Error(
      `Invalid app settings in ${settingsPaths.base}: ${parsedSettings.error.message}`,
    );
  }

  cachedSettings = parsedSettings.data;
  return cachedSettings;
}
