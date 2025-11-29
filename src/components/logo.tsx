import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
};

export const Logo = ({ width = 180, height, ...props }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 520"
      role="img"
      aria-label="Bite Lite Products Ltd. logo"
      width={width}
      height={height}
      {...props}
    >
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2aa84f" />
          <stop offset="18%" stopColor="#bcd92a" />
          <stop offset="36%" stopColor="#ffd200" />
          <stop offset="56%" stopColor="#ff4f6a" />
          <stop offset="76%" stopColor="#8b3bd9" />
          <stop offset="100%" stopColor="#0077c8" />
        </linearGradient>

        <linearGradient id="innerBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f6aa6" />
          <stop offset="60%" stopColor="#0a4b86" />
          <stop offset="100%" stopColor="#08355a" />
        </linearGradient>

        <radialGradient id="highlight" cx="0.27" cy="0.25" r="0.6">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="18"
            floodColor="#000"
            floodOpacity="0.25"
          />
        </filter>

        <radialGradient id="spark" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(600,300)">
        <ellipse
          rx="470"
          ry="210"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="60"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          rx="410"
          ry="180"
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="6"
        />
      </g>

      <g transform="translate(600,300)">
        <ellipse rx="420" ry="180" fill="url(#innerBlue)" filter="url(#softShadow)" />
        <ellipse
          rx="420"
          ry="180"
          fill="url(#highlight)"
          style={{ mixBlendMode: "screen", opacity: 0.85 }}
        />
      </g>

      <g transform="translate(600,160)">
        <ellipse rx="90" ry="12" fill="url(#spark)" transform="rotate(-25)" />
        <g transform="translate(40,12) scale(1.2)">
          <path
            d="M0 -18 L3 -6 L15 0 L3 6 L0 18 L-3 6 L-15 0 L-3 -6 Z"
            fill="#ffffff"
            opacity="0.95"
          />
        </g>
      </g>

      <g transform="translate(300,280) scale(1.12)">
        <text
          x="0"
          y="0"
          fontFamily="Pacifico, 'Brush Script MT', 'Brush Script Std', cursive"
          fontWeight="400"
          fontSize="170"
          fill="#ffffff"
          letterSpacing="2"
          style={{ textShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
        >
          Bite Lite
        </text>

        <text
          x="0"
          y="0"
          fontFamily="Pacifico, 'Brush Script MT', cursive"
          fontWeight="700"
          fontSize="170"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
          letterSpacing="2"
        >
          Bite Lite
        </text>
      </g>
      <g transform="translate(500,360)">
            <text x="0" y="0" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="34" fill="#ffffff">
            Products Ltd.
            </text>
      </g>

      <g transform="translate(600,300)">
        <ellipse
          rx="420"
          ry="180"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};