"use client";

import { useState } from "react";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa6";
import { packageItems } from "@/lib/content";
import { PackageInquiryModal } from "./package-inquiry-modal";
import styles from "./floating-contact-actions.module.scss";

type ContactChannel = "email" | "whatsapp";

export function FloatingContactActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferredChannel, setPreferredChannel] =
    useState<ContactChannel>("email");
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [note, setNote] = useState("");

  function openModal(channel: ContactChannel) {
    setPreferredChannel(channel);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function togglePackage(packageId: string) {
    setSelectedPackageIds((current) =>
      current.includes(packageId)
        ? current.filter((id) => id !== packageId)
        : [...current, packageId],
    );
  }

  function selectAllInCategory(category: string, checked: boolean) {
    const categoryPackageIds = packageItems
      .filter((item) => item.category === category)
      .map((item) => item.id);

    setSelectedPackageIds((current) => {
      if (checked) {
        return [...new Set([...current, ...categoryPackageIds])];
      }

      return current.filter((id) => !categoryPackageIds.includes(id));
    });
  }

  return (
    <>
      <nav className={styles.actions} aria-label="Quick contact actions">
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => openModal("whatsapp")}
          aria-label="Open WhatsApp package picker"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>WhatsApp</span>
        </button>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => openModal("email")}
          aria-label="Open email package picker"
        >
          <FaEnvelope aria-hidden="true" />
          <span>Email</span>
        </button>
      </nav>

      <PackageInquiryModal
        open={isOpen}
        preferredChannel={preferredChannel}
        selectedPackageIds={selectedPackageIds}
        arrivalDate={arrivalDate}
        departureDate={departureDate}
        note={note}
        onClose={closeModal}
        onTogglePackage={togglePackage}
        onSelectAllInCategory={selectAllInCategory}
        onArrivalDateChange={setArrivalDate}
        onDepartureDateChange={setDepartureDate}
        onNoteChange={setNote}
      />
    </>
  );
}
