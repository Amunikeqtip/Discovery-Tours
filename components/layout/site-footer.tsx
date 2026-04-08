import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { siteNavigation } from "@/lib/content";
import styles from "./site-footer.module.scss";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandBlock}>
          <BrandLogo compact />
          <span>
            A premium tourism and hospitality website for transfers,
            accommodation, and activities.
          </span>
        </div>
        <nav aria-label="Footer navigation" className={styles.nav}>
          {siteNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
