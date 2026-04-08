import type { IconType } from "react-icons";
import styles from "./icon-orb.module.scss";

type Tone = "sky" | "gold" | "rose" | "mint" | "violet" | "amber";

type IconOrbProps = {
  icon: IconType;
  tone?: Tone;
  size?: number;
  className?: string;
};

export function IconOrb({
  icon: Icon,
  tone = "sky",
  size = 18,
  className = "",
}: IconOrbProps) {
  const toneClass = styles[tone];

  return (
    <span className={`${styles.orb} ${toneClass} ${className}`.trim()} aria-hidden="true">
      <Icon size={size} className={styles.icon} />
    </span>
  );
}
