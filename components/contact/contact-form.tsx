"use client";

import { useState, useTransition } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import {
  contactServiceOptions,
  getContactServiceSelectionFieldLabel,
  getContactServiceSelectionOptions,
  getDefaultContactServiceSelection,
} from "@/lib/content";
import type { ContactInterest } from "@/lib/types";
import styles from "./contact-form.module.scss";

type ContactFormProps = {
  initialInterest: ContactInterest;
  initialMessage?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  submitLabel?: string;
  footerNote?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: ContactInterest;
  serviceSelection: string;
  arrivalDate: string;
  departureDate: string;
  guestCount: string;
  message: string;
};

type FormFeedback = {
  kind: "idle" | "success" | "error";
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState | "travelDates", string>>;

function createInitialState(
  serviceInterest: ContactInterest,
  initialMessage = "",
): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    serviceInterest,
    serviceSelection: getDefaultContactServiceSelection(serviceInterest),
    arrivalDate: "",
    departureDate: "",
    guestCount: "",
    message: initialMessage,
  };
}

function formatTravelDatesForSubmission(
  arrivalDate: string,
  departureDate: string,
) {
  if (!arrivalDate && !departureDate) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatValue = (value: string) =>
    formatter.format(new Date(`${value}T00:00:00`));

  if (arrivalDate && departureDate) {
    return `${formatValue(arrivalDate)} to ${formatValue(departureDate)}`;
  }

  if (arrivalDate) {
    return `From ${formatValue(arrivalDate)}`;
  }

  return `Until ${formatValue(departureDate)}`;
}

export function ContactForm({
  initialInterest,
  initialMessage = "",
  eyebrow = "Inquiry Form",
  heading = "Send details directly to the admin inbox",
  description = "Fields are validated server-side before the message is sent through the configured SMTP transport.",
  submitLabel = "Send Inquiry",
  footerNote = "SMTP settings remain server-side. No credentials are exposed to the client.",
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    createInitialState(initialInterest, initialMessage),
  );
  const [feedback, setFeedback] = useState<FormFeedback>({
    kind: "idle",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const serviceSelectionOptions = getContactServiceSelectionOptions(
    form.serviceInterest,
  );
  const serviceSelectionLabel = getContactServiceSelectionFieldLabel(
    form.serviceInterest,
  );

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateServiceInterest(serviceInterest: ContactInterest) {
    setForm((current) => ({
      ...current,
      serviceInterest,
      serviceSelection: getDefaultContactServiceSelection(serviceInterest),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback({ kind: "idle", message: "" });
    setFieldErrors({});

    if (
      form.arrivalDate &&
      form.departureDate &&
      form.departureDate < form.arrivalDate
    ) {
      setFeedback({
        kind: "error",
        message: "Departure date must be the same as or later than the arrival date.",
      });
      setFieldErrors({
        departureDate: "Choose a departure date after the arrival date.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            serviceInterest: form.serviceInterest,
            serviceSelection: form.serviceSelection,
            travelDates: formatTravelDatesForSubmission(
              form.arrivalDate,
              form.departureDate,
            ),
            guestCount: form.guestCount,
            message: form.message,
          }),
        });

        const result = (await response.json()) as {
          message?: string;
          fieldErrors?: FieldErrors;
        };

        if (!response.ok) {
          setFeedback({
            kind: "error",
            message:
              result.message ??
              "We could not submit your inquiry. Please review the form and try again.",
          });
          setFieldErrors(result.fieldErrors ?? {});
          return;
        }

        setFeedback({
          kind: "success",
          message:
            result.message ??
            "Your inquiry has been sent. The admin team can now review your request.",
        });
        setForm(createInitialState(initialInterest, initialMessage));
      } catch {
        setFeedback({
          kind: "error",
          message:
            "We could not submit your inquiry right now. Please check your connection and try again.",
        });
      }
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className={styles.gridTwo}>
        <label className={styles.field}>
          <span>Full name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            placeholder="Enter your name"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <small>{fieldErrors.name}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Email address</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            placeholder="your@email.com"
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <small>{fieldErrors.email}</small> : null}
        </label>
      </div>

      <div className={styles.gridTwo}>
        <label className={styles.field}>
          <span>Phone or WhatsApp</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            placeholder="+263..."
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? <small>{fieldErrors.phone}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Service interest</span>
          <select
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={(event) =>
              updateServiceInterest(event.target.value as ContactInterest)
            }
            aria-invalid={Boolean(fieldErrors.serviceInterest)}
          >
            {contactServiceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.serviceInterest ? (
            <small>{fieldErrors.serviceInterest}</small>
          ) : null}
        </label>
      </div>

      <label className={styles.field}>
        <span>{serviceSelectionLabel}</span>
        <select
          name="serviceSelection"
          value={form.serviceSelection}
          onChange={(event) => updateField("serviceSelection", event.target.value)}
          aria-invalid={Boolean(fieldErrors.serviceSelection)}
        >
          {serviceSelectionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.serviceSelection ? (
          <small>{fieldErrors.serviceSelection}</small>
        ) : null}
      </label>

      <div className={styles.gridTwo}>
        <label className={styles.field}>
          <span>Arrival date</span>
          <input
            type="date"
            name="arrivalDate"
            value={form.arrivalDate}
            onChange={(event) => updateField("arrivalDate", event.target.value)}
            aria-invalid={Boolean(fieldErrors.arrivalDate || fieldErrors.travelDates)}
          />
          {fieldErrors.arrivalDate || fieldErrors.travelDates ? (
            <small>{fieldErrors.arrivalDate ?? fieldErrors.travelDates}</small>
          ) : null}
        </label>

        <label className={styles.field}>
          <span>Departure date</span>
          <input
            type="date"
            name="departureDate"
            value={form.departureDate}
            onChange={(event) => updateField("departureDate", event.target.value)}
            min={form.arrivalDate || undefined}
            aria-invalid={Boolean(fieldErrors.departureDate || fieldErrors.travelDates)}
          />
          {fieldErrors.departureDate ? <small>{fieldErrors.departureDate}</small> : null}
        </label>
      </div>

      <label className={styles.field}>
        <span>Guest count</span>
        <input
          type="number"
          name="guestCount"
          value={form.guestCount}
          onChange={(event) => updateField("guestCount", event.target.value)}
          min="1"
          max="50"
          inputMode="numeric"
          placeholder="2"
          aria-invalid={Boolean(fieldErrors.guestCount)}
        />
        {fieldErrors.guestCount ? <small>{fieldErrors.guestCount}</small> : null}
      </label>

      <label className={styles.field}>
        <span>Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={7}
          placeholder="Tell the admin team about your travel style, priorities, and the kind of support you need."
          aria-invalid={Boolean(fieldErrors.message)}
        />
        {fieldErrors.message ? <small>{fieldErrors.message}</small> : null}
      </label>

      {feedback.kind !== "idle" ? (
        <div
          className={`${styles.feedback} ${
            feedback.kind === "success" ? styles.feedbackSuccess : styles.feedbackError
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className={styles.actions}>
        <button type="submit" className="buttonPrimary" disabled={isPending}>
          <FaPaperPlane aria-hidden="true" />
          {isPending ? "Sending Inquiry..." : submitLabel}
        </button>
        <p>{footerNote}</p>
      </div>
    </form>
  );
}
