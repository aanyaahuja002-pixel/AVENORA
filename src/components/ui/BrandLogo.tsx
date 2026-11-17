import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({ className = "", showTagline = true }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="AVENORA Home"
      className={`group inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-90 ${className}`}
    >
      {/* Luxury Architectural Monogram Emblem */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#B9D7E8]/30 bg-[#263C50]/60 backdrop-blur-md shadow-[0_0_15px_rgba(185,215,232,0.15)] transition-transform duration-500 group-hover:scale-105">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          aria-hidden="true"
        >
          {/* Architectural chevron/apex */}
          <path
            d="M8 30L20 9L32 30"
            stroke="#FFF9F4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossbeam horizon line */}
          <path
            d="M13 22H27"
            stroke="#F6B99D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Central sanctuary dot */}
          <circle cx="20" cy="18" r="1.5" fill="#B9D7E8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-serif tracking-[0.28em] text-lg lg:text-xl font-light uppercase text-[#FFF9F4]">
          AVENORA
        </span>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#B9D7E8]/80 font-sans -mt-0.5">
            Private Horizons
          </span>
        )}
      </div>
    </Link>
  );
}
