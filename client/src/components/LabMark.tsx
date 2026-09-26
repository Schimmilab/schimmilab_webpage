/**
 * schimmilab-Bildmarke: Sechseck mit Erlenmeyerkolben.
 * Gleiche Geometrie wie favicon.svg, YouTube-Profilbild und Video-Abspann.
 */
interface LabMarkProps {
  className?: string;
}

export default function LabMark({ className = "w-8 h-8" }: LabMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${className} transition-[filter] duration-300 group-hover:drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]`}
      fill="none"
      stroke="#00d4ff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4L28 11V21L16 28L4 21V11L16 4Z" opacity={0.6} />
      <path d="M12 10h8M14 10v3M18 10v3M13 13h6M14 13l-2 9M18 13l2 9M12 22h8" />
    </svg>
  );
}
