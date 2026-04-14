"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEnvelope, FaXmark, FaWhatsapp } from "react-icons/fa6";
import { packageCategories, packageItems } from "@/lib/content";
import {
  formatQuickContactDate,
  getQuickContactMailtoHref,
  getQuickContactWhatsappHref,
} from "@/lib/quick-contact";
import styles from "./package-inquiry-modal.module.scss";

type ContactChannel = "email" | "whatsapp";

type PackageInquiryModalProps = {
  open: boolean;
  preferredChannel: ContactChannel;
  selectedPackageIds: string[];
  arrivalDate: string;
  departureDate: string;
  note: string;
  onClose: () => void;
  onTogglePackage: (packageId: string) => void;
  onSelectAllInCategory: (category: string, checked: boolean) => void;
  onArrivalDateChange: (date: string) => void;
  onDepartureDateChange: (date: string) => void;
  onNoteChange: (note: string) => void;
};

function countSelectedPackageIds(selectedPackageIds: string[]) {
  return selectedPackageIds.length;
}

export function PackageInquiryModal({
  open,
  preferredChannel,
  selectedPackageIds,
  arrivalDate,
  departureDate,
  note,
  onClose,
  onTogglePackage,
  onSelectAllInCategory,
  onArrivalDateChange,
  onDepartureDateChange,
  onNoteChange,
}: PackageInquiryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const selectedCount = countSelectedPackageIds(selectedPackageIds);
  const emailHref = getQuickContactMailtoHref(
    selectedPackageIds,
    arrivalDate,
    departureDate,
    note,
  );
  const whatsappHref = getQuickContactWhatsappHref(
    selectedPackageIds,
    arrivalDate,
    departureDate,
    note,
  );
  const primaryAction = preferredChannel === "email" ? emailHref : whatsappHref;
  const secondaryAction = preferredChannel === "email" ? whatsappHref : emailHref;
  const primaryLabel = preferredChannel === "email" ? "Email" : "WhatsApp";
  const secondaryLabel = preferredChannel === "email" ? "WhatsApp" : "Email";
  const selectedItems = packageItems.filter((item) =>
    selectedPackageIds.includes(item.id),
  );
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  function matchesSearch(itemTitle: string, itemSummary: string, categoryTitle: string) {
    if (!normalizedSearchTerm) {
      return true;
    }

    return [itemTitle, itemSummary, categoryTitle].some((value) =>
      value.toLowerCase().includes(normalizedSearchTerm),
    );
  }

  const visibleCategories = packageCategories
    .map((category) => {
      const categoryPackages = packageItems.filter(
        (item) => item.category === category.slug,
      );
      const visiblePackages = categoryPackages.filter((item) =>
        matchesSearch(item.title, item.summary, category.title),
      );

      return {
        category,
        categoryPackages,
        visiblePackages,
      };
    })
    .filter(({ visiblePackages }) => visiblePackages.length > 0);

  function closeModal() {
    setSearchTerm("");
    onClose();
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={closeModal}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-inquiry-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className="eyebrow">Quick Inquiry</p>
            <h2 id="package-inquiry-title">Choose the packages you want</h2>
            <p>
              Select one or more packages, add a note if you want, then send the
              inquiry by email or WhatsApp.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Close package picker"
          >
            <FaXmark aria-hidden="true" />
          </button>
        </header>

        <div className={styles.summaryBar}>
          <span>{selectedCount} selected</span>
          <span>
            {arrivalDate || departureDate
              ? [
                  arrivalDate
                    ? `Arrival: ${formatQuickContactDate(arrivalDate)}`
                    : "Arrival date missing",
                  departureDate
                    ? `Departure: ${formatQuickContactDate(departureDate)}`
                    : "Departure date missing",
                ].join(" | ")
              : "Add arrival and departure dates"}
          </span>
          <span>Use the checkboxes to build your enquiry</span>
        </div>

        <div className={styles.dateGrid}>
          <label className={styles.dateField}>
            <span>Arrival date</span>
            <input
              type="date"
              value={arrivalDate}
              onChange={(event) => onArrivalDateChange(event.target.value)}
            />
          </label>
          <label className={styles.dateField}>
            <span>Departure date</span>
            <input
              type="date"
              value={departureDate}
              min={arrivalDate || undefined}
              onChange={(event) => onDepartureDateChange(event.target.value)}
            />
          </label>
        </div>

        <label className={styles.searchField}>
          <span>Search packages</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Type a package name or category"
          />
        </label>

        {selectedItems.length > 0 ? (
          <div className={styles.selectedList} aria-label="Selected packages">
            {selectedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.selectedChip}
                onClick={() => onTogglePackage(item.id)}
              >
                {item.title}
                <FaXmark aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}

        <div className={styles.categoryList}>
          {visibleCategories.length > 0 ? (
            visibleCategories.map(
              ({ category, categoryPackages, visiblePackages }) => {
                const selectedInCategory = categoryPackages.filter((item) =>
                  selectedPackageIds.includes(item.id),
                ).length;
                const categoryFullySelected =
                  categoryPackages.length > 0 &&
                  selectedInCategory === categoryPackages.length;

                return (
                  <section key={category.slug} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <div>
                        <p>{category.tagline}</p>
                        <h3>{category.title}</h3>
                      </div>
                      <button
                        type="button"
                        className={styles.categoryToggle}
                        onClick={() =>
                          onSelectAllInCategory(
                            category.slug,
                            !categoryFullySelected,
                          )
                        }
                      >
                        {categoryFullySelected ? "Clear category" : "Select category"}
                      </button>
                    </div>
                    <p className={styles.categoryDescription}>
                      {category.description}
                    </p>
                    <div className={styles.packageList}>
                      {visiblePackages.map((item) => {
                        const checked = selectedPackageIds.includes(item.id);

                        return (
                          <label key={item.id} className={styles.packageOption}>
                            <div className={styles.packageMedia}>
                              <Image
                                src={item.gallery[0].src}
                                alt={item.gallery[0].alt}
                                fill
                                sizes="(max-width: 720px) 100vw, 50vw"
                                className={styles.packageImage}
                              />
                              <span className={styles.packageBadge}>
                                {item.categoryLabel}
                              </span>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onTogglePackage(item.id)}
                                className={styles.packageCheckbox}
                                aria-label={`Select ${item.title}`}
                              />
                            </div>
                            <span className={styles.packageCopy}>
                              <strong>{item.title}</strong>
                              <small>{item.summary}</small>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </section>
                );
              },
            )
          ) : (
            <p className={styles.emptyState}>
              No packages match your search. Try a different keyword or clear the
              search box.
            </p>
          )}
        </div>

        <label className={styles.noteField}>
          <span>Add a note</span>
          <textarea
            rows={5}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Add guest count or any special request."
          />
        </label>

        <div className={styles.actionRow}>
          <a
            href={secondaryAction}
            className="buttonSecondary"
            onClick={closeModal}
          >
            {secondaryLabel}
          </a>
          <a
            href={primaryAction}
            className="buttonPrimary"
            target={preferredChannel === "whatsapp" ? "_blank" : undefined}
            rel={preferredChannel === "whatsapp" ? "noreferrer" : undefined}
            onClick={closeModal}
          >
            {primaryLabel === "WhatsApp" ? (
              <FaWhatsapp aria-hidden="true" />
            ) : (
              <FaEnvelope aria-hidden="true" />
            )}
            Send by {primaryLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
