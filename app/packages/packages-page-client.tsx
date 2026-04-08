"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { IconOrb } from "@/components/common/icon-orb";
import { SectionHeading } from "@/components/common/section-heading";
import {
  contactInterestLabels,
  packageCategories,
  packageItems,
} from "@/lib/content";
import type { PackageItem } from "@/lib/types";
import {
  FaCarSide,
  FaCircleCheck,
  FaCompass,
  FaEye,
  FaHotel,
  FaPaperPlane,
  FaXmark,
} from "react-icons/fa6";
import styles from "./page.module.scss";

const categoryIcons = {
  transfers: { icon: FaCarSide, tone: "sky" as const },
  accommodation: { icon: FaHotel, tone: "gold" as const },
  activities: { icon: FaCompass, tone: "violet" as const },
} as const;

function buildInitialMessage(selectedPackage: PackageItem) {
  return `I would like to ask about the ${selectedPackage.title} package. Please share more details about availability, suitability, and the best next steps.`;
}

export function PackagesPageClient() {
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  useEffect(() => {
    if (!selectedPackage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPackage(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPackage]);

  return (
    <>
      <section className="pageIntro">
        <div className={`container ${styles.intro}`}>
          <p className="eyebrow">Packages</p>
          <h1 className="pageTitle">
            Packages organized around the services guests need most.
          </h1>
          <p className="pageLead">
            The packages page keeps all offers easy to scan by grouping them
            into Transfers, Accommodation, and Activities. Each category uses a
            consistent structure so new offerings can be added quickly.
          </p>
          <div className="chipRow">
            {packageCategories.map((category) => (
              <a key={category.slug} href={`#${category.slug}`} className="chipLink">
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {packageCategories.map((category) => {
            const matchingPackages = packageItems.filter(
              (item) => item.category === category.slug,
            );

            return (
              <section
                id={category.slug}
                key={category.slug}
                className={styles.categorySection}
              >
                <SectionHeading
                  eyebrow={category.tagline}
                  title={category.title}
                  description={category.description}
                />
                <div className={styles.packageGrid}>
                  {matchingPackages.map((item) => (
                    <article key={item.id} className={styles.packageCard}>
                      <div className={styles.mediaSection}>
                        <div className={styles.mediaMain}>
                          <Image
                            src={item.gallery[0].src}
                            alt={item.gallery[0].alt}
                            fill
                            sizes="(max-width: 980px) 100vw, 30vw"
                            className={styles.mediaImage}
                          />
                          <div className={styles.mediaOverlay}>
                            <span>{item.categoryLabel}</span>
                            <p>{item.gallery[0].caption}</p>
                          </div>
                        </div>
                        <div className={styles.thumbnailRow}>
                          {item.gallery.slice(0, 3).map((image, index) => (
                            <div key={`${item.id}-${index}`} className={styles.thumbnail}>
                              <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="120px"
                                className={styles.thumbnailImage}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.cardHeader}>
                        <span>
                          <IconOrb
                            icon={categoryIcons[item.category].icon}
                            tone={categoryIcons[item.category].tone}
                            className={styles.categoryIcon}
                            size={14}
                          />
                          {item.categoryLabel}
                        </span>
                        <strong>{item.duration}</strong>
                      </div>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <ul>
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>
                            <IconOrb icon={FaCircleCheck} tone="mint" className={styles.listIcon} size={12} />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={`buttonSecondary ${styles.inquiryButton}`}
                          onClick={() => setSelectedPackage(item)}
                        >
                          <FaPaperPlane aria-hidden="true" />
                          Ask About This Option
                        </button>
                        <Link
                          href={`/packagedetails/${item.id}`}
                          className={`buttonSecondary ${styles.viewMoreButton}`}
                        >
                          <FaEye aria-hidden="true" />
                          View More
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {selectedPackage ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="package-inquiry-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className="eyebrow">Package Inquiry</p>
                <h2 id="package-inquiry-title">{selectedPackage.title}</h2>
                <p>
                  This inquiry is pre-selected for{" "}
                  {contactInterestLabels[selectedPackage.category]}. Share your
                  travel details below and the admin team will follow up.
                </p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedPackage(null)}
                aria-label="Close inquiry modal"
              >
                <FaXmark aria-hidden="true" />
                Close
              </button>
            </div>
            <ContactForm
              key={selectedPackage.id}
              initialInterest={selectedPackage.category}
              initialMessage={buildInitialMessage(selectedPackage)}
              eyebrow="Selected Package"
              heading={`Ask about ${selectedPackage.title}`}
              description="You can submit your inquiry without leaving the Packages page."
              submitLabel="Send Package Inquiry"
              footerNote="Your inquiry will be sent directly to the configured admin inbox."
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
