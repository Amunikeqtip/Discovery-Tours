import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { packageCategories, packageItems } from "@/lib/content";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Browse categorized packages across transfers, accommodation, and activities with clear inquiry actions.",
};

export default function PackagesPage() {
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
                      <div className={styles.cardHeader}>
                        <span>{item.categoryLabel}</span>
                        <strong>{item.duration}</strong>
                      </div>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <ul>
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      <Link
                        href={`/contact?interest=${item.category}`}
                        className="buttonSecondary"
                      >
                        Ask About This Option
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
