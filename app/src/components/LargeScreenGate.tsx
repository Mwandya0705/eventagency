// Shown only below the `lg` breakpoint: the experience is tuned for large
// screens, so smaller screens get a friendly notice instead. Pure CSS (no JS).
export default function LargeScreenGate() {
  return (
    <div className="lg:hidden fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-center px-8">
      {/* Brand mark */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white mb-10"
      >
        <path
          d="M16 2L18.5 12.5L29 15L18.5 17.5L16 28L13.5 17.5L3 15L13.5 12.5L16 2Z"
          fill="currentColor"
        />
      </svg>

      {/* Monitor icon */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-accent mb-8"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>

      <h1 className="font-display text-2xl md:text-3xl font-bold uppercase text-white tracking-wide leading-tight">
        Best on a bigger screen
      </h1>
      <p className="mt-4 text-gray-light text-sm leading-relaxed max-w-xs">
        This experience is currently optimised for desktop. Please open it on a larger screen
        (laptop or desktop) for the full experience.
      </p>
    </div>
  )
}
