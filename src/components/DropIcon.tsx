interface Props { size?: number; color?: string; className?: string }
export const DropIcon = ({ size = 12, color = "currentColor", className }: Props) => (
  <svg width={size} height={size} viewBox="0 0 16 20" className={className} fill={color} aria-hidden>
    <path d="M8 0C8 0 1 8.5 1 13a7 7 0 0 0 14 0C15 8.5 8 0 8 0Z" />
  </svg>
);
