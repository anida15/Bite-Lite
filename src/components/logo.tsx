import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
};

export const Logo = ({ width = 180, height, ...props }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      role="img"
      aria-label="Bite Lite logo"
      width={width}
      height={height}
      {...props}
    >
      <defs>
        <linearGradient id="biteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#6BCF7F" />
        </linearGradient>
      </defs>

      <g transform="translate(20, 20)">
        <circle
          cx="40"
          cy="40"
          r="35"
          fill="url(#biteGradient)"
          opacity="0.9"
        />
        <path
          d="M 40 5 Q 50 20 55 40 Q 50 60 40 75 Q 30 60 25 40 Q 30 20 40 5 Z"
          fill="#FFFFFF"
          opacity="0.3"
        />
        <path
          d="M 25 25 Q 35 30 40 25 Q 45 30 55 25"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="40"
          cy="40"
          r="35"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
        />
      </g>

      <g transform="translate(100, 30)">
        <text
          x="0"
          y="35"
          fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
          fontWeight="700"
          fontSize="42"
          fill="currentColor"
          className="text-foreground"
          letterSpacing="-1"
        >
          Bite
        </text>
        <text
          x="0"
          y="70"
          fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
          fontWeight="300"
          fontSize="32"
          fill="currentColor"
          className="text-foreground"
          letterSpacing="2"
        >
          Lite
        </text>
      </g>
    </svg>
  );
};