/* eslint-disable jsx-a11y/alt-text */
import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  companyProfile,
  formatPackagePrice,
  packageCategories,
  packageItems,
} from "@/lib/content";
import type { GeneratedMailAttachment, PackageItem } from "@/lib/types";

type BrochureProduct = {
  item: PackageItem;
  imageSource: string;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 34,
    backgroundColor: "#f8f4ec",
    color: "#13212e",
    fontSize: 11,
    lineHeight: 1.55,
  },
  cover: {
    backgroundColor: "#0f1722",
    color: "#f8fafc",
  },
  logo: {
    width: 180,
    height: 82,
    objectFit: "contain",
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: "#8fd7ff",
    marginBottom: 10,
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  coverTagline: {
    fontSize: 14,
    lineHeight: 1.5,
    color: "#d7e8f7",
    marginBottom: 16,
  },
  coverBody: {
    fontSize: 11,
    lineHeight: 1.65,
    color: "#e7edf5",
    marginBottom: 22,
  },
  contactBlock: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#152333",
    border: "1 solid #30506a",
    marginBottom: 14,
  },
  contactLine: {
    marginBottom: 5,
    color: "#f8fafc",
  },
  coverNote: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#12202d",
    color: "#d9e6f3",
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 700,
    marginBottom: 4,
    color: "#0f1722",
  },
  sectionDescription: {
    marginBottom: 18,
    color: "#40556a",
  },
  productCard: {
    marginBottom: 18,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    border: "1 solid #d8dfeb",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },
  productBody: {
    padding: 18,
  },
  productMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  productCategory: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#0ea5d9",
    marginBottom: 6,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.25,
    color: "#0f1722",
  },
  priceBox: {
    minWidth: 118,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#eef8fd",
    border: "1 solid #b9e6f8",
  },
  priceLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#0369a1",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f1722",
  },
  summary: {
    color: "#364859",
    marginBottom: 10,
  },
  highlightHeading: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f1722",
    marginBottom: 6,
  },
  highlightItem: {
    marginBottom: 4,
    color: "#44576a",
  },
  pricingNote: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 9,
  },
  footerPage: {
    justifyContent: "space-between",
  },
  footerPanel: {
    padding: 22,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    border: "1 solid #d8dfeb",
  },
  footerHeading: {
    fontSize: 21,
    fontWeight: 700,
    marginBottom: 10,
  },
  footerText: {
    marginBottom: 8,
    color: "#425466",
  },
  footerNoteText: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1 solid #dde6ef",
    color: "#6b7280",
  },
});

let cachedBrochurePromise: Promise<GeneratedMailAttachment> | null = null;
const assetCache = new Map<string, Promise<string>>();

function getPublicFilePath(assetPath: string) {
  return resolve(process.cwd(), "public", assetPath.replace(/^\/+/, ""));
}

function getMimeType(assetPath: string) {
  const lower = assetPath.toLowerCase();

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lower.endsWith(".svg")) {
    return "image/svg+xml";
  }

  return "application/octet-stream";
}

function loadAssetDataUri(assetPath: string) {
  const cached = assetCache.get(assetPath);
  if (cached) {
    return cached;
  }

  const assetPromise = readFile(getPublicFilePath(assetPath)).then((buffer) => {
    const mimeType = getMimeType(assetPath);
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  });

  assetCache.set(assetPath, assetPromise);
  return assetPromise;
}

async function loadBrochureProducts() {
  return Promise.all(
    packageItems.map(async (item) => ({
      item,
      imageSource: await loadAssetDataUri(item.gallery[0].src),
    })),
  );
}

function getBrochureProductsByCategory(products: BrochureProduct[]) {
  return packageCategories.map((category) => ({
    category,
    items: products.filter((product) => product.item.category === category.slug),
  }));
}

function BrochureDocument({
  logoSource,
  products,
}: {
  logoSource: string;
  products: BrochureProduct[];
}) {
  const groupedProducts = getBrochureProductsByCategory(products);

  return (
    <Document
      author={companyProfile.displayName}
      creator={companyProfile.displayName}
      title={`${companyProfile.displayName} Product Brochure`}
      subject="Guest brochure"
      keywords="Victoria Falls, tours, transfers, accommodation, activities"
    >
      <Page size="A4" style={[styles.page, styles.cover]}>
        <Image src={logoSource} style={styles.logo} />
        <Text style={styles.eyebrow}>Guest Brochure</Text>
        <Text style={styles.coverTitle}>{companyProfile.displayName}</Text>
        <Text style={styles.coverTagline}>{companyProfile.tagline}</Text>
        <Text style={styles.coverBody}>{companyProfile.brochureIntro}</Text>

        <View style={styles.contactBlock}>
          <Text style={styles.contactLine}>Website: {companyProfile.website}</Text>
          <Text style={styles.contactLine}>Inquiry email: {companyProfile.inquiryEmail}</Text>
          <Text style={styles.contactLine}>Phone: {companyProfile.phoneNumbers.join(" / ")}</Text>
          <Text style={styles.contactLine}>WhatsApp: {companyProfile.whatsappNumbers.join(" / ")}</Text>
          <Text style={styles.contactLine}>Address: {companyProfile.address}</Text>
        </View>

        <Text style={styles.coverNote}>{companyProfile.bookingNote}</Text>
      </Page>

      {groupedProducts.map(({ category, items }) => (
        <Page key={category.slug} size="A4" style={styles.page} wrap>
          <Text style={styles.eyebrow}>{category.tagline}</Text>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          <Text style={styles.sectionDescription}>{category.description}</Text>

          {items.map(({ item, imageSource }) => (
            <View key={item.id} style={styles.productCard} wrap={false}>
              <Image src={imageSource} style={styles.productImage} />
              <View style={styles.productBody}>
                <View style={styles.productMetaRow}>
                  <View style={{ flexGrow: 1, flexShrink: 1 }}>
                    <Text style={styles.productCategory}>{item.categoryLabel}</Text>
                    <Text style={styles.productTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>{formatPackagePrice(item)}</Text>
                  </View>
                </View>

                <Text style={styles.summary}>{item.summary}</Text>
                <Text style={styles.highlightHeading}>Included highlights</Text>
                {item.highlights.map((highlight) => (
                  <Text key={highlight} style={styles.highlightItem}>
                    • {highlight}
                  </Text>
                ))}
                {item.pricing.notes ? (
                  <Text style={styles.pricingNote}>{item.pricing.notes}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </Page>
      ))}

      <Page size="A4" style={[styles.page, styles.footerPage]}>
        <View style={styles.footerPanel}>
          <Text style={styles.footerHeading}>Plan your next step with confidence</Text>
          <Text style={styles.footerText}>
            The admin team can tailor transfers, accommodation, and activities around your preferred dates, group size, and travel style.
          </Text>
          <Text style={styles.footerText}>
            Reply to your inquiry email or contact the team directly using the details below.
          </Text>
          <Text style={styles.footerText}>Inquiry email: {companyProfile.inquiryEmail}</Text>
          <Text style={styles.footerText}>Phone: {companyProfile.phoneNumbers.join(" / ")}</Text>
          <Text style={styles.footerText}>WhatsApp: {companyProfile.whatsappNumbers.join(" / ")}</Text>
          <Text style={styles.footerText}>Website: {companyProfile.website}</Text>
          <Text style={styles.footerText}>Address: {companyProfile.address}</Text>
          <Text style={styles.footerNoteText}>{companyProfile.bookingNote}</Text>
        </View>

        <Image src={logoSource} style={styles.logo} />
      </Page>
    </Document>
  );
}

async function buildGuestBrochureAttachment(): Promise<GeneratedMailAttachment> {
  const [logoSource, brochureProducts] = await Promise.all([
    loadAssetDataUri(companyProfile.logoPath),
    loadBrochureProducts(),
  ]);

  const content = await renderToBuffer(
    <BrochureDocument logoSource={logoSource} products={brochureProducts} />,
  );

  return {
    filename: "victoria-falls-discovery-tours-brochure.pdf",
    contentType: "application/pdf",
    content,
  };
}

export async function getGuestBrochureAttachment() {
  if (!cachedBrochurePromise) {
    cachedBrochurePromise = buildGuestBrochureAttachment();
  }

  try {
    return await cachedBrochurePromise;
  } catch (error) {
    cachedBrochurePromise = null;
    throw error;
  }
}
