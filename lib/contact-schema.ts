import { z } from "zod";
import type { ContactInquiry } from "@/lib/types";

export const contactInterestOptions = [
  "transfers",
  "accommodation",
  "activities",
  "custom-itinerary",
] as const;

export const contactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters for your name.")
    .max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone or WhatsApp number.")
    .max(30, "Phone number is too long."),
  serviceInterest: z.enum(contactInterestOptions, {
    error: "Please choose a valid service interest.",
  }),
  travelDates: z
    .string()
    .trim()
    .min(3, "Please provide your travel dates or preferred travel period.")
    .max(120, "Travel dates are too long."),
  guestCount: z.coerce
    .number()
    .int("Guest count must be a whole number.")
    .min(1, "At least one guest is required.")
    .max(50, "Guest count must be 50 or less."),
  message: z
    .string()
    .trim()
    .min(20, "Please include a bit more detail in your message.")
    .max(2000, "Message is too long."),
}) satisfies z.ZodType<ContactInquiry>;
