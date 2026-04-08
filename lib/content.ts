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
    gallery: [
      {
        src: "/placeholders/transfers.svg",
        alt: "Airport arrival transfer placeholder image",
        caption: "Arrival-day welcome and airport meet-and-transfer flow.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Departure transfer coordination placeholder image",
        caption: "Departure support timed around onward flights.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Guest comfort transfer placeholder image",
        caption: "Comfort-led vehicle presentation and direct routing.",
      },
    ],
    overview: [
      "This package is designed for travelers who want the simplest possible airport arrival and departure experience.",
      "It frames the first and last movement of the trip as a premium support service, reducing uncertainty around timing, pickup, and drop-off.",
    ],
    included: [
      "Arrival transfer planning and pickup coordination",
      "Departure transfer timed to the guest's onward travel",
      "Direct guest support for handoff and movement logistics",
    ],
    perfectFor: [
      "First-time Victoria Falls visitors",
      "Guests arriving on tight schedules",
      "Couples, solo guests, and small private groups",
    ],
    logistics: [
      "Works well as a starting layer for larger itineraries",
      "Can be paired with accommodation and experience add-ons",
      "Best used when guests want predictable arrival and departure handling",
    ],
    detailSections: [
      {
        title: "What this transfer solves",
        body: [
          "The package is built to remove the most common arrival-day and departure-day friction points by keeping handoff, timing, and direct movement simple.",
          "It is ideal when the guest wants a dependable first impression and a clean final departure without needing to manage local transport details alone.",
        ],
      },
      {
        title: "How the experience is positioned",
        body: [
          "Rather than treating transport as a basic utility, the package presents it as part of the hospitality journey.",
          "That means clarity, comfort, and confidence are emphasized just as much as the transfer itself.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/transfers.svg",
        alt: "Cross-border route placeholder image",
        caption: "Border-linked movement for multi-stop travel days.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Transfer timing placeholder image",
        caption: "Pickup windows aligned with transition-heavy itineraries.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Support coordination placeholder image",
        caption: "Designed for guests who need easy movement between locations.",
      },
    ],
    overview: [
      "This package is aimed at guests whose travel plans involve more than one transition point in a single journey.",
      "It is structured to keep cross-border or cross-location movement readable and calm, especially where timing and routing matter.",
    ],
    included: [
      "Point-to-point movement planning",
      "Pickup timing support around transfer-heavy days",
      "A clearer structure for multi-stop guest logistics",
    ],
    perfectFor: [
      "Guests crossing between travel zones",
      "Travelers with multi-property or multi-country movements",
      "Itineraries that require dependable transition support",
    ],
    logistics: [
      "Best for schedules with multiple pickup and dropoff moments",
      "Can be paired with day experiences or accommodation handoffs",
      "Useful where guests want reduced friction during transit-heavy days",
    ],
    detailSections: [
      {
        title: "When this package is most valuable",
        body: [
          "This package becomes especially useful on days that combine property changes, border procedures, or onward activity timing in one sequence.",
          "It helps make those transitions feel coordinated rather than fragmented.",
        ],
      },
      {
        title: "Operational style",
        body: [
          "The presentation focuses on timing clarity, route confidence, and lower-stress movement for the guest.",
          "That makes it a strong practical product for itineraries that are otherwise easy to disrupt.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/transfers.svg",
        alt: "Private lodge transfer placeholder image",
        caption: "Private movement between lodge, hotel, and activity points.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Premium routing placeholder image",
        caption: "A cleaner transfer layer for premium itineraries.",
      },
      {
        src: "/placeholders/transfers.svg",
        alt: "Flexible schedule transfer placeholder image",
        caption: "Useful when same-day plans require smoother transitions.",
      },
    ],
    overview: [
      "This package is positioned as a direct, comfort-focused transfer between guest stays and scheduled experiences.",
      "It supports a more private, curated style of movement for travelers who want convenience without complexity.",
    ],
    included: [
      "Private lodge-to-lodge or hotel-to-activity transfer framing",
      "Flexible timing support within the scheduled transfer window",
      "Travel movement suited to premium itinerary building",
    ],
    perfectFor: [
      "Guests staying across more than one property",
      "Travelers adding private movement to a premium package",
      "Itineraries where timing and comfort need to align cleanly",
    ],
    logistics: [
      "Works especially well alongside curated stays and premium experiences",
      "Can reduce friction between stay check-in and planned excursions",
      "Supports direct routing rather than generalized transport",
    ],
    detailSections: [
      {
        title: "Guest experience angle",
        body: [
          "The package is framed around ease and privacy, giving guests a more tailored-feeling connection between locations.",
          "That makes it especially effective in hospitality-first itinerary design.",
        ],
      },
      {
        title: "Where it fits best",
        body: [
          "It sits naturally inside higher-end travel flows where the guest expects direct movement and clear pacing between trip components.",
          "It can also function as a useful upgrade for guests who prefer not to manage shared transport layers.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/accommodation.svg",
        alt: "Luxury accommodation placeholder image",
        caption: "A premium riverside stay concept with polished atmosphere.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Property storytelling placeholder image",
        caption: "Space for room, exterior, and hospitality-focused imagery.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Refined stay placeholder image",
        caption: "Ideal for guests seeking comfort, location, and elevated mood.",
      },
    ],
    overview: [
      "This accommodation package is positioned for travelers who want a more refined hospitality setting near the destination experience.",
      "The structure is intended to support premium storytelling around atmosphere, comfort, and stay quality.",
    ],
    included: [
      "Luxury-leaning accommodation positioning",
      "A stay concept ready to pair with curated transfers and activities",
      "A strong content frame for future property photography and room detail",
    ],
    perfectFor: [
      "Couples and premium leisure travelers",
      "Guests looking for destination atmosphere and elevated comfort",
      "Travelers building a polished multi-night itinerary",
    ],
    logistics: [
      "Best positioned as a multi-night hospitality anchor",
      "Pairs well with scenic and premium experience add-ons",
      "Useful where accommodation quality is a central booking driver",
    ],
    detailSections: [
      {
        title: "Stay positioning",
        body: [
          "The package is designed to communicate a premium sense of place, using the stay itself as part of the destination experience.",
          "That allows the accommodation to feel intentional rather than simply functional.",
        ],
      },
      {
        title: "Content structure for future expansion",
        body: [
          "The detail page leaves room for richer property visuals, room categories, and hospitality highlights later on.",
          "This helps the package scale naturally when final supplier imagery becomes available.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/accommodation.svg",
        alt: "Family lodge placeholder image",
        caption: "A stay structure built around practical comfort for families.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Family hospitality placeholder image",
        caption: "Designed to pair well with transfers and day experiences.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Comfort-led stay placeholder image",
        caption: "Clear hospitality messaging for multi-guest planning.",
      },
    ],
    overview: [
      "This package is designed for travelers who value an easy, comfortable family stay setup rather than an overly formal or complex accommodation experience.",
      "It is presented as a practical hospitality match that still feels polished and guest-friendly.",
    ],
    included: [
      "Family-oriented accommodation positioning",
      "A stay option suited to pairing with transfers and activities",
      "A flexible content frame for comfort and convenience messaging",
    ],
    perfectFor: [
      "Families and small mixed-age groups",
      "Travelers prioritizing comfort and easy planning",
      "Guests who want accommodation to support a wider itinerary smoothly",
    ],
    logistics: [
      "Works well where transfer support and activity add-ons are also needed",
      "Best used when clarity and comfort matter more than ultra-luxury positioning",
      "Can flex across short or longer stay windows",
    ],
    detailSections: [
      {
        title: "Family planning approach",
        body: [
          "The package is framed to reduce planning friction for guests organizing travel for more than one person or age group.",
          "This makes it especially useful for hospitality-led family journeys.",
        ],
      },
      {
        title: "Why it works operationally",
        body: [
          "Its strength lies in simplicity and compatibility with the rest of the trip.",
          "That means it can sit comfortably inside broader packages without creating extra planning burden.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/accommodation.svg",
        alt: "Romantic retreat placeholder image",
        caption: "A private, atmosphere-led stay concept for couples.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Couples package placeholder image",
        caption: "Designed for memorable multi-night travel moments.",
      },
      {
        src: "/placeholders/accommodation.svg",
        alt: "Honeymoon storytelling placeholder image",
        caption: "Ready for future honeymoon and celebration imagery.",
      },
    ],
    overview: [
      "This package presents accommodation as part of a more intimate, memorable travel rhythm for couples.",
      "It supports romantic, celebratory, and honeymoon-style positioning without requiring booking-engine complexity in v1.",
    ],
    included: [
      "Couple-focused stay framing",
      "A hospitality concept suited to premium experience pairing",
      "Space for strong image-led storytelling as content matures",
    ],
    perfectFor: [
      "Couples and honeymoon travelers",
      "Celebratory trips and anniversary travel",
      "Guests who want atmosphere and privacy to shape the stay choice",
    ],
    logistics: [
      "Pairs naturally with sunset, scenic, and premium add-ons",
      "Best used as a multi-night accommodation anchor",
      "Strong fit when experience mood matters as much as practical location",
    ],
    detailSections: [
      {
        title: "Emotional positioning",
        body: [
          "The package is built to emphasize atmosphere, intimacy, and a slower-paced sense of travel.",
          "It allows the stay itself to become one of the memorable parts of the journey.",
        ],
      },
      {
        title: "Where it can grow later",
        body: [
          "It is especially well suited for future additions like package upgrades, room categories, and visual storytelling for honeymoon content.",
          "That makes it a strong long-term product page even before final photography is available.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/activities.svg",
        alt: "Signature falls experience placeholder image",
        caption: "A flagship destination experience built around iconic moments.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Guided activity placeholder image",
        caption: "Structured for travelers who want guided context with sightseeing.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Scenic activity placeholder image",
        caption: "A strong hero package with room for future scenic imagery.",
      },
    ],
    overview: [
      "This package is intended to act as a lead activity product for the destination, centered on the most recognizable Victoria Falls experience.",
      "It gives the site a flagship activities page that can anchor wider excursion storytelling later on.",
    ],
    included: [
      "Iconic sightseeing-led experience framing",
      "A package concept that pairs easily with transfer support",
      "A strong lead product for the activities category",
    ],
    perfectFor: [
      "First-time destination visitors",
      "Travelers wanting a signature must-do experience",
      "Guests building an itinerary around the most recognizable attraction",
    ],
    logistics: [
      "Can operate as a half-day or fuller destination experience concept",
      "Pairs especially well with arrival or stay packages",
      "Useful as a hero product on both listings and detail pages",
    ],
    detailSections: [
      {
        title: "Destination role",
        body: [
          "This package works as a cornerstone product because it connects directly with the destination identity guests already recognize.",
          "That makes it especially effective as a primary activity card and detail page.",
        ],
      },
      {
        title: "Guest planning value",
        body: [
          "It helps simplify decision-making for guests who want one strong, dependable signature experience to build around.",
          "It can also act as the entry point into more layered activity planning.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/activities.svg",
        alt: "Sunset cruise placeholder image",
        caption: "A scenic evening experience with premium leisure appeal.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Dining experience placeholder image",
        caption: "Combines atmosphere, pacing, and hospitality-led moments.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Celebratory evening placeholder image",
        caption: "A strong add-on for couples and celebratory travel.",
      },
    ],
    overview: [
      "This package is designed as an atmosphere-led evening product, giving the activities range a more relaxed premium option.",
      "It broadens the site offer beyond sightseeing and adventure by emphasizing scenic leisure and polished pacing.",
    ],
    included: [
      "Sunset-oriented leisure experience framing",
      "Dining and atmosphere-led package storytelling",
      "A premium-feeling add-on for wider itineraries",
    ],
    perfectFor: [
      "Couples and celebration trips",
      "Guests wanting a slower-paced premium evening",
      "Travelers pairing scenery with hospitality moments",
    ],
    logistics: [
      "Most useful as an add-on alongside accommodation and transfer plans",
      "Strong fit for evening schedules and celebration-focused trips",
      "Helps the activity category feel more balanced and diverse",
    ],
    detailSections: [
      {
        title: "Experience mood",
        body: [
          "The package is intentionally positioned around atmosphere, pacing, and memorable evening energy rather than high-intensity activity.",
          "That gives the site a more rounded hospitality feel.",
        ],
      },
      {
        title: "Best packaging role",
        body: [
          "It works well as a companion experience inside romantic, leisure, or premium itinerary combinations.",
          "Because of that, it can play both supporting and featured roles across the site.",
        ],
      },
    ],
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
    gallery: [
      {
        src: "/placeholders/activities.svg",
        alt: "Adventure pairing placeholder image",
        caption: "A larger-scope experience combining views and guided discovery.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Aerial experience placeholder image",
        caption: "Adventure-forward positioning with premium scenic value.",
      },
      {
        src: "/placeholders/activities.svg",
        alt: "Guided discovery placeholder image",
        caption: "Built for travelers wanting energy, scenery, and structure.",
      },
    ],
    overview: [
      "This package is shaped for travelers who want a bigger-feeling destination day with both scenic impact and guided structure.",
      "It gives the site a more energetic hero option inside the activities category.",
    ],
    included: [
      "Adventure-forward package framing",
      "A scenic and guided pairing concept",
      "A strong future candidate for visually-led promotion",
    ],
    perfectFor: [
      "Travelers seeking high-impact destination moments",
      "Guests who want energy balanced with support",
      "Itineraries that need a strong featured activity",
    ],
    logistics: [
      "Best positioned as a larger featured day experience",
      "Can be layered into premium or mixed-energy itineraries",
      "Useful when the guest wants something more dynamic than a standard scenic activity",
    ],
    detailSections: [
      {
        title: "Why this stands out",
        body: [
          "The package combines a stronger sense of scale with enough guided structure to keep the experience usable for a wider range of guests.",
          "That combination makes it an effective standout product in the activities range.",
        ],
      },
      {
        title: "Detail-page storytelling value",
        body: [
          "It naturally supports imagery, detail sequencing, and highlight-led copy that encourages deeper exploration from the user.",
          "That makes it especially well suited to a dedicated package details experience.",
        ],
      },
    ],
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

export function getPackageById(id: string) {
  return packageItems.find((item) => item.id === id);
}
