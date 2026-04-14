import type { Metadata } from "next";
import Link from "next/link";
import { ImageCard } from "@/components/common/image-card";
import { IconOrb } from "@/components/common/icon-orb";
import { SectionHeading } from "@/components/common/section-heading";
import {
  featuredPackages,
  homeJourneySteps,
  serviceSummaries,
  trustHighlights,
} from "@/lib/content";
import type { ServiceCategory } from "@/lib/types";
import {
  FaBriefcase,
  FaCarSide,
  FaChartLine,
  FaCircleCheck,
  FaComments,
  FaHotel,
  FaMagnifyingGlass,
  FaPaperPlane,
  FaPersonHiking,
} from "react-icons/fa6";
import styles from "./page.module.scss";

const serviceIcons: Record<
  ServiceCategory,
  { icon: typeof FaCarSide; tone: "sky" | "gold" | "violet" }
> = {
  transfers: { icon: FaCarSide, tone: "sky" },
  accommodation: { icon: FaHotel, tone: "gold" },
  activities: { icon: FaPersonHiking, tone: "violet" },
};

const trustIcons = [
  { icon: FaCircleCheck, tone: "mint" as const },
  { icon: FaBriefcase, tone: "amber" as const },
  { icon: FaChartLine, tone: "rose" as const },
];

const journeyIcons = [
  { icon: FaMagnifyingGlass, tone: "sky" as const },
  { icon: FaComments, tone: "violet" as const },
  { icon: FaPaperPlane, tone: "gold" as const },
];

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
                  <IconOrb
                    icon={trustIcons[index]?.icon ?? FaCircleCheck}
                    tone={trustIcons[index]?.tone ?? "mint"}
                    className={styles.cardIcon}
                    size={16}
                  />
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
                  <IconOrb
                    icon={serviceIcons[service.category].icon}
                    tone={serviceIcons[service.category].tone}
                    className={styles.servicePillIcon}
                    size={15}
                  />
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
                        <IconOrb icon={FaCircleCheck} tone="mint" className={styles.listIcon} size={12} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/contact?interest=${service.category}`}
                    className="buttonSecondary"
                  >
                    <FaPaperPlane aria-hidden="true" />
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
                      <IconOrb icon={FaCircleCheck} tone="mint" className={styles.listIcon} size={12} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?interest=${item.category}`}
                  className="buttonSecondary"
                >
                  <FaPaperPlane aria-hidden="true" />
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
                <IconOrb
                  icon={journeyIcons[index]?.icon ?? FaMagnifyingGlass}
                  tone={journeyIcons[index]?.tone ?? "sky"}
                  className={styles.journeyIcon}
                  size={16}
                />
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
