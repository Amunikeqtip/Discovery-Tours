import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { packageCategories, siteNavigation, trustHighlights } from "@/lib/content";
import styles from "./site-footer.module.scss";

export function SiteFooter() {
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
            {trustHighlights.map((item) => (
              <span key={item.title}>
                <i className="pi pi-check-circle" aria-hidden="true" />
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
                  <i className="pi pi-angle-right" aria-hidden="true" />
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
                  <i className="pi pi-angle-right" aria-hidden="true" />
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
              <i className="pi pi-send" aria-hidden="true" />
              Start An Inquiry
            </Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>Victoria Falls Discovery Tours</p>
        <span>Powered By:  Amunike & Tedwell.</span>
      </div>
    </footer>
  );
}
