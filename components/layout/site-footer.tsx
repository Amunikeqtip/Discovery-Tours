"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChevronRight,
  FaCircleCheck,
  FaEnvelope,
  FaPaperPlane,
  FaPhone,
  FaUserTie,
  FaXmark,
} from "react-icons/fa6";
import { BrandLogo } from "@/components/common/brand-logo";
import { IconOrb } from "@/components/common/icon-orb";
import { packageCategories, siteNavigation, trustHighlights } from "@/lib/content";
import styles from "./site-footer.module.scss";

const highlightTones = [styles.toneSky, styles.toneGold, styles.toneRose];

type ContactPerson = {
  name: string;
  email: string;
  phone: string;
  tone: "sky" | "gold" | "rose" | "mint";
};

const contactPeople: Record<"amunike" | "tedwell", ContactPerson> = {
  amunike: {
    name: "Amunike Sibanibani",
    email: "amunikesibanibani@outlook.com",
    phone: "+263774003861",
    tone: "sky",
  },
  tedwell: {
    name: "Tedwell",
    email: "tedwell@outlook.com",
    phone: "+263789276807",
    tone: "rose",
  },
};

export function SiteFooter() {
  const [selectedPerson, setSelectedPerson] = useState<keyof typeof contactPeople | null>(null);

  useEffect(() => {
    if (!selectedPerson) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPerson(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPerson]);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.topSection}`}>
        <div className={styles.brandPanel}>
          <BrandLogo compact />
          <p>
            Enterprise-ready travel presentation for transfers, accommodation,
            and curated activities across Victoria Falls.
          </p>
          <div className={styles.highlightRow}>
            {trustHighlights.map((item, index) => (
              <span key={item.title}>
                <FaCircleCheck
                  className={`${styles.inlineIcon} ${highlightTones[index % highlightTones.length]}`}
                  aria-hidden="true"
                />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h2>Services</h2>
            <div className={styles.linkGroup}>
              {packageCategories.map((category) => (
                <Link key={category.slug} href={`/packages#${category.slug}`}>
                  <FaChevronRight className={`${styles.linkIcon} ${styles.toneSky}`} aria-hidden="true" />
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h2>Explore</h2>
            <div className={styles.linkGroup}>
              {siteNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <FaChevronRight className={`${styles.linkIcon} ${styles.toneMint}`} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h2>Inquiries</h2>
            <p>
              Use the inquiry form to request more detail about a package,
              transfer setup, stay preference, or activity plan.
            </p>
            <Link href="/contact" className={`buttonPrimary ${styles.footerCta}`}>
              <FaPaperPlane className={styles.ctaIcon} aria-hidden="true" />
              Start An Inquiry
            </Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>Victoria Falls Discovery Tours</p>
        <div className={styles.poweredBy}>
          <span>Powered By:</span>
          <button type="button" className={styles.personButton} onClick={() => setSelectedPerson("amunike")}>
            Amunike
          </button>
          <span className={styles.poweredSeparator}>&</span>
          <button type="button" className={styles.personButton} onClick={() => setSelectedPerson("tedwell")}>
            Tedwell
          </button>
        </div>
      </div>

      {selectedPerson ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-contact-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className="eyebrow">Contact</p>
                <h2 id="footer-contact-title">{contactPeople[selectedPerson].name}</h2>
                <p>Quick contact details for direct follow-up.</p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedPerson(null)}
                aria-label="Close contact details"
              >
                <FaXmark aria-hidden="true" />
                Close
              </button>
            </div>

            <div className={styles.modalGrid}>
              <div className={`${styles.modalCard} ${styles.modalCardAccent}`}>
                <IconOrb icon={FaUserTie} tone={contactPeople[selectedPerson].tone} className={styles.modalIcon} size={18} />
                <span>Name</span>
                <strong>{contactPeople[selectedPerson].name}</strong>
              </div>
              <a className={styles.modalCard} href={`mailto:${contactPeople[selectedPerson].email}`}>
                <IconOrb icon={FaEnvelope} tone="gold" className={styles.modalIcon} size={18} />
                <span>Email</span>
                <strong>{contactPeople[selectedPerson].email}</strong>
              </a>
              <a className={styles.modalCard} href={`tel:${contactPeople[selectedPerson].phone.replaceAll(" ", "")}`}>
                <IconOrb icon={FaPhone} tone="mint" className={styles.modalIcon} size={18} />
                <span>Phone</span>
                <strong>{contactPeople[selectedPerson].phone}</strong>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
