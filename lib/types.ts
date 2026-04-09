export type ServiceCategory = "transfers" | "accommodation" | "activities";

export type ContactInterest = ServiceCategory | "custom-itinerary";

export type PackagePricing = {
  amount: number | null;
  currency: string;
  label?: string;
  notes?: string;
};

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
  pricing: PackagePricing;
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

export type CompanyProfile = {
  displayName: string;
  tagline: string;
  brochureIntro: string;
  address: string;
  website: string;
  inquiryEmail: string;
  phoneNumbers: string[];
  whatsappNumbers: string[];
  bookingNote: string;
  logoPath: string;
};

export type GeneratedMailAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
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
