export const dataUses: string[] = [
  "To generate personalised daily suggestions and layering analysis",
  "To build your Fragrance DNA profile from your collection",
  "To power the weekly rotation planner and discovery features",
  "To process subscription payments securely",
  "To send you transactional emails (account confirmation, subscription receipts)",
  "To improve Olfaire's fragrance database and suggestion quality",
];

export interface ThirdParty {
  name: string;
  desc: string;
}

export const thirdParties: ThirdParty[] = [
  {
    name: "Authentication",
    desc: "Manages sign-in via Apple and Google. We do not store your password or have access to your account credentials.",
  },
  {
    name: "AI processing",
    desc: "Your fragrance data and mood selections are processed to generate personalised suggestions. No personal identifiers (name, email, or account ID) are included in these requests.",
  },
  {
    name: "Payments",
    desc: "Subscription management handled through Apple and Google. We receive subscription status only — never payment card details.",
  },
  {
    name: "Weather",
    desc: "City-level weather context for daily suggestions. Only your city name is used — no GPS coordinates or precise location.",
  },
];

export const userRights: string[] = [
  "Access all data we hold about you",
  "Correct inaccurate information",
  "Delete your account and all associated data",
  "Export your collection data",
  "Opt out of non-essential communications",
];
