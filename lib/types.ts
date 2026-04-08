export type ServiceCategory = "transfers" | "accommodation" | "activities";

export type ContactInterest = ServiceCategory | "custom-itinerary";

export type VisualAsset = {
  src: string;
  alt: string;
  caption: string;
};

export type PackageDetailSection = {
  title: string;
  body: string[];
};

export type ServiceSummary = {
  category: ServiceCategory;
  title: string;
  shortLabel: string;
  headline: string;
  description: string;
  highlights: string[];
  visual: VisualAsset;
};

export type PackageItem = {
  id: string;
  category: ServiceCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  highlights: string[];
  duration: string;
  gallery: VisualAsset[];
  overview: string[];
  included: string[];
  perfectFor: string[];
  logistics: string[];
  detailSections: PackageDetailSection[];
};

export type PackageCategoryDefinition = {
  slug: ServiceCategory;
  title: string;
  tagline: string;
  description: string;
};

export type AboutSection = {
  eyebrow: string;
  title: string;
  body: string[];
};

export type AboutValue = {
  title: string;
  description: string;
};

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: ContactInterest;
  serviceSelection: string;
  travelDates: string;
  guestCount: number;
  message: string;
};
