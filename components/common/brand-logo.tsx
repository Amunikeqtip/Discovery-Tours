import Image from "next/image";
import styles from "./brand-logo.module.scss";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`${styles.logo} ${compact ? styles.compact : ""}`}>
      <Image
        src="/brand/discovery.png"
        aria-label="Victoria Falls Discovery Tours logo"
        alt="Victoria Falls Discovery Tours logo"
        width={400}
        height={180}
        priority={compact}
        className={styles.image}
      />
    </div>
  );
}
