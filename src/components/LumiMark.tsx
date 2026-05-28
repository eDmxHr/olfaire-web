interface LumiMarkProps {
  size?: number
  wingColor?: string
  bodyColor?: string
  className?: string
}

export function LumiMark({
  size = 48,
  wingColor = '#1C1A18',
  bodyColor = '#B07D2A',
  className = '',
}: LumiMarkProps) {
  const h = size * (88 / 100)

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 100 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Upper wings */}
      <path
        d="M47 36 C42 26 22 16 8 22 C2 28 6 40 16 44 C28 48 42 44 47 40"
        fill={wingColor}
      />
      <path
        d="M53 36 C58 26 78 16 92 22 C98 28 94 40 84 44 C72 48 58 44 53 40"
        fill={wingColor}
      />
      {/* Lower wings */}
      <path
        d="M46 44 C38 50 22 56 18 66 C15 74 24 77 34 70 C43 64 47 56 47 48"
        fill={wingColor}
        opacity="0.75"
      />
      <path
        d="M54 44 C62 50 78 56 82 66 C85 74 76 77 66 70 C57 64 53 56 53 48"
        fill={wingColor}
        opacity="0.75"
      />
      {/* Wing veins */}
      <path
        d="M47 38 C36 36 22 30 12 28"
        stroke="#FAF9F6"
        strokeWidth="0.8"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M53 38 C64 36 78 30 88 28"
        stroke="#FAF9F6"
        strokeWidth="0.8"
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Body amber line */}
      <line
        x1="50" y1="26" x2="50" y2="68"
        stroke={bodyColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Head */}
      <circle cx="50" cy="22" r="4" fill={wingColor} />
      {/* Antennae */}
      <path
        d="M48 19 Q38 12 30 5"
        stroke={wingColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M52 19 Q62 12 70 5"
        stroke={wingColor}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Antennae tips */}
      <circle cx="30" cy="5" r="2" fill={bodyColor} />
      <circle cx="70" cy="5" r="2" fill={bodyColor} />
    </svg>
  )
}
