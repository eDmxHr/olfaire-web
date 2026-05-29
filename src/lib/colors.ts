export const colors = {
  parchment: "#FAF9F6",
  ink:       "#1C1A18",
  amber:     "#B07D2A",
  linen:     "#EDEAE3",
  ash:       "#8C8680",
  dust:      "#D4CFC8",
  red:       "#C4503A",
} as const

export const amberAlpha = (opacity: number) =>
  `rgba(176, 125, 42, ${opacity})`
