export const lumiQuotes: string[] = [
  "Rain is coming. Vetiver knows how to stay.",
  "\"The vetiver in Encre Noire gives Chloé's rose a shadow it doesn't have alone.\"",
  "\"Thursday is yours. Wear something that knows how to stay.\"",
]

export interface CollectionStat {
  number: string
  label: string
}

export const collectionStats: CollectionStat[] = [
  { number: "1176+", label: "Fragrances in database" },
  { number: "30",    label: "Fragrance families" },
  { number: "5",     label: "Mood categories" },
]

export interface Feature {
  icon: string
  title: string
  description: string
  variant: "light" | "dark"
}

export const features: Feature[] = [
  {
    icon: "✦",
    title: "Your daily pick",
    description: "Every morning, Lumi asks how you're feeling. Five moods. One answer. She picks the right bottle from your shelf and tells you exactly why — in a sentence worth reading.",
    variant: "light",
  },
  {
    icon: "◈",
    title: "Layering chemistry",
    description: "Pick two bottles. Lumi analyses the actual note chemistry — which notes anchor, amplify, contrast, or clash. Application order, body placement, ratios. The science behind why it works.",
    variant: "dark",
  },
  {
    icon: "◎",
    title: "Your signatures",
    description: "When you find a combination that works, name it. Save it. Share a beautifully designed card. Your combinations, given names worth owning.",
    variant: "light",
  },
]

export interface Persona {
  title: string
  description: string
}

export const personas: Persona[] = [
  {
    title: "The Collector",
    description: "Owns 15–60 bottles. Reads Fragrantica. Frustrated that half her shelf never gets worn. Wants a rotation that feels intentional.",
  },
  {
    title: "The Explorer",
    description: "Growing collection. Wants to understand layering but doesn't know where to start. Craves a trusted guide.",
  },
  {
    title: "The Social One",
    description: "Trend-aware. Follows fragrance creators. Loves sharing her rotation. Drives organic growth through shareable signature cards.",
  },
]
