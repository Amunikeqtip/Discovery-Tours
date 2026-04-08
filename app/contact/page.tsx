import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { contactChecklist, contactServiceOptions } from "@/lib/content";
import type { ContactInterest } from "@/lib/types";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send an inquiry directly to the admin team with your travel dates, guest count, service interest, and travel notes.",
};

type ContactPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const validInterests = new Set(contactServiceOptions.map((option) => option.value));

function resolveInterest(rawValue: string | string[] | undefined): ContactInterest {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

  if (value && validInterests.has(value as ContactInterest)) {
    return value as ContactInterest;
  }

  return "custom-itinerary";
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialInterest = resolveInterest(resolvedSearchParams?.interest);

  return (
    <>
      <section className="pageIntro">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introCopy}>
            <p className="eyebrow">Contact</p>
            <h1 className="pageTitle">
              Let the admin team know what kind of journey you are planning.
            </h1>
            <p className="pageLead">
              The enquiry form is designed for fast completion while still
              capturing the details needed to shape a helpful response. Messages
              are submitted server-side and delivered through the configured SMTP
              account.
            </p>
          </div>
          <aside className={styles.contactGuide}>
            <h2>Helpful details to include</h2>
            <ul>
              {contactChecklist.map((item) => (
                <li key={item}>
                  <i className="pi pi-check-circle" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.contactGrid}`}>
          <div className={styles.formPanel}>
            <ContactForm initialInterest={initialInterest} />
          </div>
          <div className={styles.infoPanel}>
            <div className={styles.infoCard}>
              <i className={`pi pi-comments ${styles.infoIcon}`} aria-hidden="true" />
              <p className="eyebrow">Inquiry First</p>
              <h2>Designed for tailored follow-up</h2>
              <p>
                Rather than forcing visitors into a booking engine too early,
                the contact flow gathers enough context for a more thoughtful,
                hospitality-led reply from the admin team.
              </p>
            </div>
            <div className={styles.infoCard}>
              <i className={`pi pi-envelope ${styles.infoIcon}`} aria-hidden="true" />
              <p className="eyebrow">Admin Setup</p>
              <h2>Environment-based mail delivery</h2>
              <p>
                SMTP credentials stay on the server only. The receiving inbox is
                controlled through <code>ADMIN_CONTACT_EMAIL</code>, making it
                easy to change the admin recipient without editing application
                code.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
