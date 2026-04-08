import type { Metadata } from "next";
import { PackagesPageClient } from "./packages-page-client";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Browse categorized packages across transfers, accommodation, and activities with clear inquiry actions.",
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
