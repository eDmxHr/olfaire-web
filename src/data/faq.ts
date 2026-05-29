export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: "How does the daily suggestion work?",
    a: "Every morning you select a mood — soft, bold, cosy, sharp, or mysterious. Lumi uses your mood, your collection's note data, and contextual factors like the day and weather to suggest the most fitting bottle from your shelf. The suggestion includes Lumi's reasoning in one precise sentence.",
  },
  {
    q: "What does the layering chemistry analysis actually do?",
    a: "Lumi analyses the note pyramids of two fragrances and identifies how their notes interact — whether they anchor, amplify, contrast, or clash. She provides a compatibility score, an application guide (which bottle first, how long to wait, where to apply), and explains the chemistry behind the recommendation.",
  },
  {
    q: "My fragrance isn't in the database. What do I do?",
    a: "You can add it manually. Enter the house name, fragrance name, and concentration — Lumi will attempt to fill in the notes pyramid and other details automatically. If she's uncertain, the data is flagged and you can edit it. Your contribution will be reviewed and added to the shared catalogue.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Olfaire subscriptions are managed through Apple. To cancel, go to your iPhone Settings → [your name] → Subscriptions → Olfaire → Cancel. Cancellation takes effect at the end of the current billing period.",
  },
  {
    q: "Can I restore my purchase on a new device?",
    a: 'Yes. Sign in with the same Apple ID or Google account you used originally and tap "Restore purchases" in the Settings screen.',
  },
  {
    q: "How is my fragrance collection data used?",
    a: "Your collection data is used only to power Lumi's suggestions. A minimal, anonymised subset (fragrance names and notes) is sent to our AI provider to generate recommendations. Your name, email, and account details are never included in these requests.",
  },
  {
    q: "What happens when I delete my account?",
    a: "All your data — collection, daily logs, signatures, preferences — is permanently deleted within 30 days. This cannot be undone. Export your collection data first if you want to keep a record.",
  },
  {
    q: "Lumi's suggestion doesn't match my mood. Can I get another?",
    a: 'Yes. On the Daily Pick screen, tap "Suggest another" and Lumi will generate a different recommendation from your collection.',
  },
]
