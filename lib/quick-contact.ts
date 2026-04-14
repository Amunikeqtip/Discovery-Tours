import {
  companyProfile,
  packageCategories,
  packageItems,
} from "@/lib/content";

function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function getSelectedPackageItems(selectedPackageIds: string[]) {
  const selectedIds = new Set(selectedPackageIds);

  return packageCategories.flatMap((category) =>
    packageItems.filter(
      (item) => item.category === category.slug && selectedIds.has(item.id),
    ),
  );
}

function buildSelectedPackageLines(selectedPackageIds: string[]) {
  const selectedIds = new Set(selectedPackageIds);

  return packageCategories.flatMap((category) => {
    const matchingPackages = packageItems.filter(
      (item) => item.category === category.slug && selectedIds.has(item.id),
    );

    if (matchingPackages.length === 0) {
      return [];
    }

    return [
      `${category.title}:`,
      ...matchingPackages.map((item) => `- ${item.title}`),
      "",
    ];
  });
}

function buildSelectedPackageSummary(selectedPackageIds: string[]) {
  const selectedItems = getSelectedPackageItems(selectedPackageIds);

  if (selectedItems.length === 0) {
    return "selected packages";
  }

  if (selectedItems.length === 1) {
    return selectedItems[0].title;
  }

  return `${selectedItems[0].title} + ${selectedItems.length - 1} more`;
}

export function formatQuickContactDate(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function buildQuickContactTravelDates(
  arrivalDate: string,
  departureDate: string,
) {
  const arrivalLabel = formatQuickContactDate(arrivalDate);
  const departureLabel = formatQuickContactDate(departureDate);

  if (!arrivalLabel && !departureLabel) {
    return [
      "- Arrival date: Please add your arrival date",
      "- Departure date: Please add your departure date",
    ];
  }

  return [
    `- Arrival date: ${arrivalLabel || "Please add your arrival date"}`,
    `- Departure date: ${departureLabel || "Please add your departure date"}`,
  ];
}

export function buildQuickContactSubject(selectedPackageIds: string[]) {
  return `Victoria Falls Discovery Tours inquiry - ${buildSelectedPackageSummary(
    selectedPackageIds,
  )}`;
}

export function buildQuickContactBody(
  selectedPackageIds: string[],
  arrivalDate = "",
  departureDate = "",
  note = "",
) {
  const selectedPackageLines = buildSelectedPackageLines(selectedPackageIds);
  const travelDateLines = buildQuickContactTravelDates(arrivalDate, departureDate);

  return [
    `Hello ${companyProfile.displayName},`,
    "",
    "I would like to make an inquiry about the package options below.",
    "",
    "Selected packages:",
    ...(selectedPackageLines.length > 0
      ? selectedPackageLines
      : ["- Please help me choose the best package(s).", ""]),
    "Travel dates:",
    ...travelDateLines,
    "",
    "Additional note:",
    note.trim() || "Please help me tailor this inquiry.",
    "",
    "Kind regards,",
  ].join("\r\n");
}

export function getQuickContactMailtoHref(
  selectedPackageIds: string[],
  arrivalDate = "",
  departureDate = "",
  note = "",
) {
  return `mailto:${companyProfile.inquiryEmail}?subject=${encodeURIComponent(
    buildQuickContactSubject(selectedPackageIds),
  )}&body=${encodeURIComponent(
    buildQuickContactBody(selectedPackageIds, arrivalDate, departureDate, note),
  )}`;
}

export function getQuickContactWhatsappHref(
  selectedPackageIds: string[],
  arrivalDate = "",
  departureDate = "",
  note = "",
) {
  const primaryWhatsappNumber = companyProfile.whatsappNumbers[0];

  return `https://wa.me/${normalizePhoneNumber(primaryWhatsappNumber)}?text=${encodeURIComponent(
    buildQuickContactBody(selectedPackageIds, arrivalDate, departureDate, note),
  )}`;
}
