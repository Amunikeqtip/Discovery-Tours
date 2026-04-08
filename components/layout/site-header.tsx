"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/brand-logo";
import { siteNavigation } from "@/lib/content";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <BrandLogo compact />
        </Link>
        <nav aria-label="Primary navigation" className={styles.nav}>
          {siteNavigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/contact" className={`buttonPrimary ${styles.cta}`}>
          Start An Inquiry
        </Link>
      </div>
    </header>
  );
}
