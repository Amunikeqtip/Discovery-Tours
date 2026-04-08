"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRightLong, FaBars, FaXmark } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/brand-logo";
import { siteNavigation } from "@/lib/content";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <BrandLogo compact />
        </Link>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
        </button>
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
      </div>

      {isMenuOpen ? (
        <div className={styles.mobileMenu} role="presentation" onClick={() => setIsMenuOpen(false)}>
          <div
            id="mobile-navigation"
            className={styles.mobilePanel}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.mobileHeading}>
              <p className="eyebrow">Explore</p>
              <h2>Choose a page</h2>
              <p>Select where you want to go next.</p>
            </div>
            <nav aria-label="Mobile navigation" className={styles.mobileNav}>
              {siteNavigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <FaArrowRightLong aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
