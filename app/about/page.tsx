import type { Metadata } from "next";
import Link from "next/link";
import { ImageCard } from "@/components/common/image-card";
import { SectionHeading } from "@/components/common/section-heading";
import { aboutSections, aboutValues, trustHighlights } from "@/lib/content";
import styles from "./page.module.scss";

const trustIcons = ["pi pi-check-circle", "pi pi-briefcase", "pi pi-chart-line"];

const valueIcons = ["pi pi-th-large", "pi pi-images", "pi pi-bolt"];

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the service philosophy, hospitality standards, and guest-first approach behind Victoria Falls Discovery Tours.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pageIntro">
        <div className={`container ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">About Us</p>
            <h1 className="pageTitle">
              A hospitality-minded partner for thoughtful travel planning.
            </h1>
            <p className="pageLead">
              Victoria Falls Discovery Tours is structured to make every stage of
              travel feel more intentional, from arrival logistics to stay
              recommendations and memorable activities. The brand experience
              centers on clarity, comfort, and polished support.
            </p>
            <div className="pillList">
              {trustHighlights.map((item, index) => (
                <span key={item.title} className="pill">
                  <i className={trustIcons[index] ?? "pi pi-check-circle"} aria-hidden="true" />
                  {item.title}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <ImageCard
              src="/placeholders/accommodation.svg"
              alt="Illustrated placeholder for future hospitality photography"
              label="Brand story visual"
              caption="A structured image block ready for real lodge, transfer, or destination photography."
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Service Provider Detail"
            title="The brand story is presented in clear, trust-building sections"
            description="These content blocks give the provider enough room to explain experience, standards, and what guests can expect before they enquire."
          />
          <div className={styles.sectionGrid}>
            {aboutSections.map((section) => (
              <article key={section.title} className={styles.sectionCard}>
                <p>{section.eyebrow}</p>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why Guests Choose Us"
            title="The experience is shaped around practical confidence"
            description="Rather than overwhelming visitors with clutter, the site explains how planning works and why the service model is built for ease."
          />
          <div className={styles.valuesGrid}>
            {aboutValues.map((value, index) => (
              <article key={value.title} className={styles.valueCard}>
                <i className={`${valueIcons[index] ?? "pi pi-check-circle"} ${styles.valueIcon}`} aria-hidden="true" />
                <h2>{value.title}</h2>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.aboutCta}>
            <div>
              <p className="eyebrow">Next Step</p>
              <h2>Share your plans and let the admin team tailor the next reply.</h2>
            </div>
            <Link href="/contact" className="buttonPrimary">
              Contact The Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
