import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageById, packageItems } from "@/lib/content";
import styles from "./page.module.scss";

type PackageDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return packageItems.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: PackageDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const packageItem = getPackageById(id);

  if (!packageItem) {
    return {
      title: "Package Not Found",
    };
  }

  return {
    title: `${packageItem.title} Details`,
    description: packageItem.summary,
  };
}

export default async function PackageDetailsPage({
  params,
}: PackageDetailsPageProps) {
  const { id } = await params;
  const packageItem = getPackageById(id);

  if (!packageItem) {
    notFound();
  }

  return (
    <>
      <section className="pageIntro">
        <div className={`container ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">{packageItem.categoryLabel} Details</p>
            <h1 className="pageTitle">{packageItem.title}</h1>
            <p className="pageLead">{packageItem.summary}</p>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <i className={`pi pi-calendar ${styles.statIcon}`} aria-hidden="true" />
                <span>Duration</span>
                <strong>{packageItem.duration}</strong>
              </div>
              <div className={styles.statCard}>
                <i className={`pi pi-tag ${styles.statIcon}`} aria-hidden="true" />
                <span>Service Type</span>
                <strong>{packageItem.categoryLabel}</strong>
              </div>
              <div className={styles.statCard}>
                <i className={`pi pi-images ${styles.statIcon}`} aria-hidden="true" />
                <span>Picture Slots</span>
                <strong>{packageItem.gallery.length} visuals</strong>
              </div>
            </div>
            <div className="buttonRow">
              <Link
                href={`/contact?interest=${packageItem.category}`}
                className="buttonPrimary"
              >
                <i className="pi pi-send" aria-hidden="true" />
                Inquire About This Package
              </Link>
              <Link href="/packages" className="buttonSecondary">
                <i className="pi pi-arrow-left" aria-hidden="true" />
                Back To Packages
              </Link>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <div className={styles.heroImage}>
              <Image
                src={packageItem.gallery[0].src}
                alt={packageItem.gallery[0].alt}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 42vw"
                className={styles.coverImage}
              />
              <div className={styles.heroOverlay}>
                <span>{packageItem.categoryLabel}</span>
                <p>{packageItem.gallery[0].caption}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.gallerySection}`}>
          <div className={styles.galleryHeader}>
            <div>
              <p className="eyebrow">Pictures</p>
              <h2>Scrollable package visuals</h2>
            </div>
            <p>
              This gallery is designed so the user can move through package
              imagery while reading the detail page in a clean, structured flow.
            </p>
          </div>
          <div className={styles.galleryScroller}>
            {packageItem.gallery.map((image) => (
              <article key={image.alt} className={styles.galleryCard}>
                <div className={styles.galleryImage}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 980px) 85vw, 33vw"
                    className={styles.coverImage}
                  />
                </div>
                <p>{image.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.contentGrid}`}>
          <div className={styles.mainColumn}>
            <article className={styles.infoCard}>
              <p className="eyebrow">Overview</p>
              <h2>How this package is structured</h2>
              {packageItem.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>

            {packageItem.detailSections.map((section) => (
              <article key={section.title} className={styles.infoCard}>
                <p className="eyebrow">Detail</p>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>

          <aside className={styles.sideColumn}>
            <article className={styles.listCard}>
              <p className="eyebrow">Highlights</p>
              <h2>Included in the presentation</h2>
              <ul>
                {packageItem.included.map((item) => (
                  <li key={item}>
                    <i className="pi pi-check-circle" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.listCard}>
              <p className="eyebrow">Best For</p>
              <h2>Ideal guest profile</h2>
              <ul>
                {packageItem.perfectFor.map((item) => (
                  <li key={item}>
                    <i className="pi pi-users" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.listCard}>
              <p className="eyebrow">Logistics</p>
              <h2>Operational notes</h2>
              <ul>
                {packageItem.logistics.map((item) => (
                  <li key={item}>
                    <i className="pi pi-map-marker" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
