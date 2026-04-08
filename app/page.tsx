import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { ImageCard } from "@/components/common/image-card";
import { SectionHeading } from "@/components/common/section-heading";
import {
  featuredPackages,
  homeJourneySteps,
  serviceSummaries,
  trustHighlights,
} from "@/lib/content";
import type { ServiceCategory } from "@/lib/types";
import styles from "./page.module.scss";

const serviceIcons: Record<ServiceCategory, string> = {
  transfers: "pi pi-car",
  accommodation: "pi pi-home",
  activities: "pi pi-compass",
};

const trustIcons = ["pi pi-check-circle", "pi pi-briefcase", "pi pi-chart-line"];

const journeyIcons = ["pi pi-search", "pi pi-comments", "pi pi-send"];

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore tailored transfers, hospitality-led accommodation, and memorable Victoria Falls activities in one premium experience.",
};

export default function HomePage() {
  return (
    <>
      <section className={`section ${styles.heroSection}`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBrand}>
              <BrandLogo />
            </div>
            <p className="eyebrow">Tourism & Hospitality</p>
            <h1 className="pageTitle">
              A refined way to discover Victoria Falls with comfort built in.
            </h1>
            <p className="pageLead">
              Victoria Falls Discovery Tours brings transfers, accommodation,
              and activities together in one polished experience so travellers
              can move from planning to arrival with clarity and confidence.
            </p>
            <div className="buttonRow">
              <Link href="/packages" className="buttonPrimary">
                Explore Packages
              </Link>
              <Link href="/contact" className="buttonSecondary">
                Plan Your Inquiry
              </Link>
            </div>
            <div className={styles.highlightGrid}>
              {trustHighlights.map((highlight, index) => (
                <article key={highlight.title} className={styles.highlightCard}>
                  <i className={`${trustIcons[index] ?? "pi pi-check-circle"} ${styles.cardIcon}`} aria-hidden="true" />
                  <h2>{highlight.title}</h2>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <ImageCard
              src="/photos/victoria-falls-hero.jpg"
              alt="Panoramic Victoria Falls view used as the site hero image"
              label="Victoria Falls"
              caption="Real destination photography now anchors the first impression of the site."
              priority
            />
            <div className={styles.servicePills}>
              {serviceSummaries.map((service) => (
                <Link
                  key={service.category}
                  href={`/contact?interest=${service.category}`}
                  className={styles.servicePill}
                >
                  <i className={`${serviceIcons[service.category]} ${styles.servicePillIcon}`} aria-hidden="true" />
                  <span>{service.title}</span>
                  <strong>{service.shortLabel}</strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Core Services"
            title="Built around the essentials every journey needs"
            description="Every service area is presented clearly so guests can understand what is included and move directly into an enquiry."
          />
          <div className={styles.servicesGrid}>
            {serviceSummaries.map((service) => (
              <article key={service.category} className={styles.serviceCard}>
                <div className={styles.serviceImage}>
                  <ImageCard
                    src={service.visual.src}
                    alt={service.visual.alt}
                    label={service.shortLabel}
                    caption={service.visual.caption}
                  />
                </div>
                <div className={styles.serviceBody}>
                  <p className={styles.serviceTag}>{service.title}</p>
                  <h3>{service.headline}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.highlights.map((highlight) => (
                      <li key={highlight}>
                        <i className="pi pi-check-circle" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/contact?interest=${service.category}`}
                    className="buttonSecondary"
                  >
                    <i className="pi pi-send" aria-hidden="true" />
                    Ask About {service.shortLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Featured Packages"
            title="A quick view of how packages are presented"
            description="The same card structure can scale as more offers and future photography are added."
          />
          <div className={styles.packageGrid}>
            {featuredPackages.map((item) => (
              <article key={item.id} className={styles.packageCard}>
                <div className={styles.packageMeta}>
                  <span>{item.categoryLabel}</span>
                  <strong>{item.duration}</strong>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>
                      <i className="pi pi-check-circle" aria-hidden="true" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?interest=${item.category}`}
                  className="buttonSecondary"
                >
                  <i className="pi pi-send" aria-hidden="true" />
                  Inquire About This Package
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.journeySection}`}>
        <div className="container">
          <SectionHeading
            eyebrow="Guest Journey"
            title="Designed for easy discovery, easy enquiry, and easy follow-up"
            description="The site supports an inquiry-first process that keeps the experience smooth while leaving space for future booking features."
          />
          <div className={styles.journeyGrid}>
            {homeJourneySteps.map((step, index) => (
              <article key={step.title} className={styles.journeyCard}>
                <i className={`${journeyIcons[index] ?? "pi pi-circle"} ${styles.journeyIcon}`} aria-hidden="true" />
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.bottomCta}>
            <div>
              <p className="eyebrow">Ready To Start</p>
              <h2>Tell us what kind of experience you want to shape.</h2>
            </div>
            <div className="buttonRow">
              <Link href="/about" className="buttonSecondary">
                Learn About The Brand
              </Link>
              <Link href="/contact" className="buttonPrimary">
                Send An Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
