"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaArrowRightLong,
  FaBars,
  FaMoon,
  FaSun,
  FaXmark,
} from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/brand-logo";
import { siteNavigation } from "@/lib/content";
import { useThemePreference } from "./theme-provider";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenuPathname, setOpenMenuPathname] = useState<string | null>(null);
  const { theme, toggleTheme } = useThemePreference();
  const isMenuOpen = openMenuPathname === pathname;
  const isBlackTheme = theme === "black";

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
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeButton}
            aria-pressed={isBlackTheme}
            aria-label={`Switch to ${isBlackTheme ? "white" : "black"} theme`}
            onClick={toggleTheme}
          >
            {isBlackTheme ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
            <span>{isBlackTheme ? "White" : "Black"}</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setOpenMenuPathname((current) => (current === pathname ? null : pathname))
            }
          >
            {isMenuOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className={styles.mobileMenu} role="presentation" onClick={() => setOpenMenuPathname(null)}>
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
                    onClick={() => setOpenMenuPathname(null)}
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
