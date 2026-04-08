import type {
  AboutSection,
  AboutValue,
  ContactInterest,
  PackageCategoryDefinition,
  PackageItem,
  ServiceSummary,
} from "@/lib/types";

export const siteNavigation = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const categoryLabels = {
  transfers: "Transfers",
  accommodation: "Accommodation",
  activities: "Activities",
} as const;

export const contactInterestLabels: Record<ContactInterest, string> = {
  transfers: "Transfers",
  accommodation: "Accommodation",
  activities: "Activities",
  "custom-itinerary": "Custom itinerary",
};

export const serviceSummaries: ServiceSummary[] = [
  {
    category: "transfers",
    title: "Transfers",
    shortLabel: "Smooth arrivals",
    headline: "Arrival, departure, and inter-property movements handled with ease.",
    description:
      "Transfer services are positioned as dependable, well-paced logistics support so guests can move between airports, lodges, borders, and activity points without confusion.",
    highlights: [
      "Airport pickups and departure coordination",
      "Hotel, lodge, and border transfer planning",
      "Private movement designed around guest comfort",
    ],
    visual: {
      src: "/placeholders/transfers.svg",
      alt: "Abstract placeholder visual for transfer services",
      caption: "A dedicated image slot for future transport and arrival photography.",
    },
  },
  {
    category: "accommodation",
    title: "Accommodation",
    shortLabel: "Stay selection",
    headline: "Thoughtful accommodation options framed with hospitality in mind.",
    description:
      "Accommodation offerings are presented as curated stay solutions, helping guests match comfort level, atmosphere, and location to the type of trip they want to create.",
    highlights: [
      "Luxury, boutique, and comfort-led stay positioning",
      "Options suited to couples, families, and small groups",
      "Strong visual storytelling space for each property later on",
    ],
    visual: {
      src: "/placeholders/accommodation.svg",
      alt: "Abstract placeholder visual for accommodation services",
      caption: "A gallery-ready area for future lodge and hospitality imagery.",
    },
  },
  {
    category: "activities",
    title: "Activities",
    shortLabel: "Curated experiences",
    headline: "Experiences that add memorable highlights to every itinerary.",
    description:
      "Activities are grouped to help guests quickly understand the style of experience available, from scenic signature moments to guided adventure and relaxed add-ons.",
    highlights: [
      "Signature destination experiences",
      "Relaxed leisure and premium add-ons",
      "Flexible options that can pair with stays and transfers",
    ],
    visual: {
      src: "/placeholders/activities.svg",
      alt: "Abstract placeholder visual for activities",
      caption: "A visual placeholder for future excursion and destination photography.",
    },
  },
];

export const trustHighlights = [
  {
    title: "Guest-first planning",
    description:
      "Content, layout, and CTAs are shaped around calm decision-making rather than clutter.",
  },
  {
    title: "Hospitality-led tone",
    description:
      "The brand presentation feels warm, polished, and reassuring from the first screen.",
  },
  {
    title: "Easy future expansion",
    description:
      "Packages, content blocks, and image areas are ready to scale as the site grows.",
  },
];

export const packageCategories: PackageCategoryDefinition[] = [
  {
    slug: "transfers",
    title: "Transfers",
    tagline: "Move smoothly",
    description:
      "Transfer packages are grouped here so guests can quickly choose the support they need for arrivals, departures, and movement between locations.",
  },
  {
    slug: "accommodation",
    title: "Accommodation",
    tagline: "Stay beautifully",
    description:
      "Accommodation packages create a clear home for hospitality-led stay options, from elegant lodge matches to tailored romantic escapes.",
  },
  {
    slug: "activities",
    title: "Activities",
    tagline: "Experience more",
    description:
      "Activities packages turn iconic destination moments into clean, bookable-looking cards while still guiding visitors toward an enquiry flow in v1.",
  },
];

export const packageItems: PackageItem[] = [
  {
    id: "arrival-departure-transfer",
    category: "transfers",
    categoryLabel: categoryLabels.transfers,
    title: "Airport Arrival & Departure Transfer",
    summary:
      "A polished transfer option for guests who want a seamless welcome into their trip and a well-managed departure at the end of it.",
    highlights: [
      "Arrival meet-and-transfer planning",
      "Departure timing aligned with onward travel",
      "Suitable for solo travelers, couples, or small groups",
    ],
    duration: "Single transfer service",
  },
  {
    id: "border-shuttle-support",
    category: "transfers",
    categoryLabel: categoryLabels.transfers,
    title: "Cross-Border Shuttle Support",
    summary:
      "A practical option for guests who need coordinated movement between border points, accommodation, and onward experiences.",
    highlights: [
      "Useful for multi-stop travel days",
      "Clear coordination around pickup windows",
      "Built for low-friction guest logistics",
    ],
    duration: "Point-to-point coordination",
  },
  {
    id: "private-lodge-connection",
    category: "transfers",
    categoryLabel: categoryLabels.transfers,
    title: "Private Lodge Connection Transfer",
    summary:
      "A comfort-led transfer service between lodges, hotels, and scheduled activities for guests who prefer direct movement.",
    highlights: [
      "Ideal for same-day itinerary changes",
      "Private travel feel with easy timing",
      "Helpful add-on for premium itineraries",
    ],
    duration: "Flexible transfer window",
  },
  {
    id: "riverside-luxury-stay",
    category: "accommodation",
    categoryLabel: categoryLabels.accommodation,
    title: "Riverside Luxury Stay Curation",
    summary:
      "A hospitality-forward accommodation concept for travellers seeking elegant surroundings and strong destination atmosphere.",
    highlights: [
      "Luxury-oriented positioning",
      "Suitable for refined leisure travel",
      "Ready for rich room and property photography later",
    ],
    duration: "Multi-night stay planning",
  },
  {
    id: "family-lodge-match",
    category: "accommodation",
    categoryLabel: categoryLabels.accommodation,
    title: "Family-Friendly Lodge Match",
    summary:
      "An accommodation package designed for guests who want comfort, ease, and a practical stay setup for family travel.",
    highlights: [
      "Comfort-conscious hospitality framing",
      "Works well with transfer and activity combinations",
      "Clear messaging for family planning journeys",
    ],
    duration: "Flexible stay length",
  },
  {
    id: "romantic-retreat",
    category: "accommodation",
    categoryLabel: categoryLabels.accommodation,
    title: "Romantic Retreat Stay",
    summary:
      "A curated stay concept suited to couples who want privacy, atmosphere, and a travel experience that feels intentionally paced.",
    highlights: [
      "Couple-focused presentation",
      "Pairs naturally with premium activity add-ons",
      "Strong storytelling potential for honeymoon content",
    ],
    duration: "Tailored multi-night stay",
  },
  {
    id: "signature-falls-day",
    category: "activities",
    categoryLabel: categoryLabels.activities,
    title: "Signature Falls Day Experience",
    summary:
      "A flagship activity concept for guests who want a memorable first look at Victoria Falls with guided support and strong destination context.",
    highlights: [
      "Iconic destination positioning",
      "Easy to bundle with transfers",
      "Ideal as a hero package for the activities category",
    ],
    duration: "Half-day to full-day",
  },
  {
    id: "sunset-cruise-dining",
    category: "activities",
    categoryLabel: categoryLabels.activities,
    title: "Sunset Cruise & Dining Combination",
    summary:
      "A relaxed premium add-on for guests who want scenic evening pacing, polished hospitality, and a memorable atmosphere.",
    highlights: [
      "Leisure-led experience framing",
      "Works beautifully for couples and celebratory travel",
      "Adds variety to the activity mix",
    ],
    duration: "Evening experience",
  },
  {
    id: "aerial-guided-adventure",
    category: "activities",
    categoryLabel: categoryLabels.activities,
    title: "Aerial & Guided Adventure Pairing",
    summary:
      "An activity concept for travellers who want a bigger-scope destination moment with energy, views, and guided discovery combined.",
    highlights: [
      "Adventure-forward positioning",
      "Balances scenic appeal with guided support",
      "Strong candidate for future featured imagery",
    ],
    duration: "Multi-part day experience",
  },
];

export const featuredPackages = [packageItems[0], packageItems[3], packageItems[6]];

export const homeJourneySteps = [
  {
    step: "Step 01",
    title: "Explore services and categories",
    description:
      "Guests can understand the offer quickly through structured sections and clear package groupings.",
  },
  {
    step: "Step 02",
    title: "Select the type of support needed",
    description:
      "Inquiry links carry visitors into a contact flow with the most relevant service interest already selected.",
  },
  {
    step: "Step 03",
    title: "Submit details directly to admin",
    description:
      "The final step is a guided enquiry form that sends the request server-side to the configured admin inbox.",
  },
];

export const aboutSections: AboutSection[] = [
  {
    eyebrow: "Who We Are",
    title: "A brand built around seamless travel support",
    body: [
      "Victoria Falls Discovery Tours is presented as a service provider that helps guests shape their trip through dependable planning, warm hospitality language, and clear communication.",
      "The goal is not simply to list services, but to present a polished experience where transfers, stays, and activities feel connected rather than fragmented.",
    ],
  },
  {
    eyebrow: "How We Work",
    title: "Designed to make decisions easier for travellers",
    body: [
      "The website gives travellers a quick understanding of what is available while still leaving room for tailored support through the inquiry process.",
      "This structure supports premium service positioning without introducing unnecessary complexity in the first release.",
    ],
  },
  {
    eyebrow: "What We Value",
    title: "Comfort, clarity, and confidence at every touchpoint",
    body: [
      "Every page is designed to reduce friction, support readability, and keep the next step obvious whether the guest is browsing on a phone or desktop.",
      "That balance between polished presentation and practical usability is central to the hospitality identity of the site.",
    ],
  },
];

export const aboutValues: AboutValue[] = [
  {
    title: "Clear package structure",
    description:
      "Organized categories help the admin team expand services later without rethinking the site architecture.",
  },
  {
    title: "Hospitality-ready storytelling",
    description:
      "Sections are designed to hold richer provider details, lodge descriptions, and image-led trust signals as content grows.",
  },
  {
    title: "Performance-conscious UX",
    description:
      "The interface favors efficient rendering, restrained motion, and strong visual hierarchy over heavy effects.",
  },
];

export const contactServiceOptions: Array<{
  value: ContactInterest;
  label: string;
}> = [
  { value: "transfers", label: "Transfers" },
  { value: "accommodation", label: "Accommodation" },
  { value: "activities", label: "Activities" },
  { value: "custom-itinerary", label: "Custom itinerary" },
];

export const contactChecklist = [
  "What service or package you are most interested in",
  "Your preferred travel dates or month of travel",
  "How many guests will be traveling",
  "Any comfort level, activity, or accommodation preferences",
];
