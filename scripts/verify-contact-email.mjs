import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const builtRoutePath = resolve(
  projectRoot,
  ".next",
  "server",
  "app",
  "api",
  "contact",
  "route.js",
);
const outputDirectory = resolve(projectRoot, ".mail-drop");

if (!existsSync(builtRoutePath)) {
  console.error("Build output not found. Run `npm run build` before `npm run test:email`.");
  process.exit(1);
}

rmSync(outputDirectory, { recursive: true, force: true });

const { POST } = require(builtRoutePath);

const payload = {
  name: "Template Verification Guest",
  email: "guest@example.com",
  phone: "+263771234567",
  serviceInterest: "activities",
  travelDates: "May 1-4, 2026",
  guestCount: 4,
  message:
    "Please share activity options, pickup timing, and a sample itinerary for our group.",
};

const response = await POST(
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }),
);
const body = await response.json();

if (!response.ok) {
  console.error("Contact route returned an error:");
  console.error(JSON.stringify(body, null, 2));
  process.exit(1);
}

const generatedFiles = readdirSync(outputDirectory).sort();
const adminHtmlFile = generatedFiles.find(
  (fileName) => fileName.includes("-admin-") && fileName.endsWith(".html"),
);

if (!adminHtmlFile) {
  console.error("Admin HTML preview was not generated in .mail-drop.");
  process.exit(1);
}

const adminHtml = readFileSync(resolve(outputDirectory, adminHtmlFile), "utf8");
const expectedSnippets = [
  "Admin Inquiry Alert",
  payload.name,
  payload.email,
  payload.message,
];

for (const snippet of expectedSnippets) {
  if (!adminHtml.includes(snippet)) {
    console.error(`Admin preview is missing expected content: ${snippet}`);
    process.exit(1);
  }
}

console.log("Contact email verification passed.");
console.log(`Route message: ${body.message}`);
console.log("Generated files:");

for (const fileName of generatedFiles) {
  console.log(`- ${fileName}`);
}
