import Link from "next/link";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa6";
import { companyProfile } from "@/lib/content";
import styles from "./floating-contact-actions.module.scss";

function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function FloatingContactActions() {
  const whatsappNumber = companyProfile.whatsappNumbers[0];
  const whatsappHref = `https://wa.me/${normalizePhoneNumber(whatsappNumber)}`;

  return (
    <nav className={styles.actions} aria-label="Quick contact actions">
      <Link
        href={whatsappHref}
        className={styles.actionButton}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact the admin team on WhatsApp"
      >
        <FaWhatsapp aria-hidden="true" />
        <span>WhatsApp</span>
      </Link>
      <Link
        href={`mailto:${companyProfile.inquiryEmail}`}
        className={styles.actionButton}
        aria-label="Send an email to the admin team"
      >
        <FaEnvelope aria-hidden="true" />
        <span>Email</span>
      </Link>
    </nav>
  );
}
