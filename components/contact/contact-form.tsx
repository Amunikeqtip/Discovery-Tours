"use client";

import { useState, useTransition } from "react";
import { contactServiceOptions } from "@/lib/content";
import type { ContactInterest } from "@/lib/types";
import styles from "./contact-form.module.scss";

type ContactFormProps = {
  initialInterest: ContactInterest;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: ContactInterest;
  travelDates: string;
  guestCount: string;
  message: string;
};

type FormFeedback = {
  kind: "idle" | "success" | "error";
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function createInitialState(serviceInterest: ContactInterest): FormState {
  return {
    name: "",
    email: "",
    phone: "",
    serviceInterest,
    travelDates: "",
    guestCount: "",
    message: "",
  };
}

export function ContactForm({ initialInterest }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(() => createInitialState(initialInterest));
  const [feedback, setFeedback] = useState<FormFeedback>({
    kind: "idle",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback({ kind: "idle", message: "" });
    setFieldErrors({});

    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
      setForm(createInitialState(initialInterest));
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <div>
          <p className="eyebrow">Inquiry Form</p>
          <h2>Send details directly to the admin inbox</h2>
        </div>
        <p>
          Fields are validated server-side before the message is sent through the
          configured SMTP transport.
        </p>
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
              updateField("serviceInterest", event.target.value as ContactInterest)
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

      <div className={styles.gridTwo}>
        <label className={styles.field}>
          <span>Travel dates</span>
          <input
            type="text"
            name="travelDates"
            value={form.travelDates}
            onChange={(event) => updateField("travelDates", event.target.value)}
            placeholder="e.g. 12-16 July 2026"
            aria-invalid={Boolean(fieldErrors.travelDates)}
          />
          {fieldErrors.travelDates ? <small>{fieldErrors.travelDates}</small> : null}
        </label>

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
      </div>

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
          {isPending ? "Sending Inquiry..." : "Send Inquiry"}
        </button>
        <p>
          SMTP settings remain server-side. No credentials are exposed to the
          client.
        </p>
      </div>
    </form>
  );
}
