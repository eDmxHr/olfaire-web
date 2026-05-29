export const dataUses: string[] = [
  "To generate personalised daily suggestions and layering analysis via the Anthropic Claude API",
  "To build your Fragrance DNA profile from your collection",
  "To power the weekly rotation planner and discovery features",
  "To process subscription payments via RevenueCat and Apple",
  "To send you transactional emails (account confirmation, subscription receipts)",
  "To improve Olfaire's fragrance database and suggestion quality",
];

export interface ThirdParty {
  name: string;
  desc: string;
}

export const thirdParties: ThirdParty[] = [
  {
    name: "Supabase",
    desc: "Database and authentication infrastructure. Data is stored in EU regions by default.",
  },
  {
    name: "Anthropic (Claude API)",
    desc: "Your fragrance collection data and mood selections are sent to Claude to generate suggestions. No personally identifiable information (name, email, ID) is included in these requests.",
  },
  {
    name: "RevenueCat",
    desc: "Subscription management. Handles payment processing through Apple and Google. We receive subscription status only — not payment card details.",
  },
  {
    name: "OpenWeather API",
    desc: "City-level weather data for context in daily suggestions. Only your city name is transmitted — no GPS coordinates.",
  },
];

export const userRights: string[] = [
  "Access all data we hold about you",
  "Correct inaccurate information",
  "Delete your account and all associated data",
  "Export your collection data",
  "Opt out of non-essential communications",
];
