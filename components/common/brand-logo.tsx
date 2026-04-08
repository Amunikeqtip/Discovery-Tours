import styles from "./brand-logo.module.scss";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`${styles.logo} ${compact ? styles.compact : ""}`}>
      <svg
        viewBox="0 0 180 110"
        role="img"
        aria-label="Victoria Falls Discovery Tours logo"
        className={styles.symbol}
      >
        <path
          d="M8 20H134L78 102L8 20Z"
          fill="#05080C"
        />
        <path
          d="M168 22H134L82 102H114L168 22Z"
          fill="#05080C"
        />
        <path
          d="M40 40H116L78 97L40 40Z"
          fill="#F7FBFF"
        />
        <rect x="54" y="49" width="5" height="30" rx="2.5" fill="#00AEEF" />
        <rect x="64" y="49" width="5" height="42" rx="2.5" fill="#00AEEF" />
        <rect x="74" y="49" width="5" height="36" rx="2.5" fill="#00AEEF" />
        <rect x="84" y="49" width="5" height="44" rx="2.5" fill="#00AEEF" />
        <rect x="94" y="49" width="5" height="30" rx="2.5" fill="#00AEEF" />
        <path
          d="M33 34H139"
          stroke="#05080C"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <div className={styles.wordmark}>
        <span>Victoria Falls</span>
        <strong>Discovery Tours</strong>
      </div>
    </div>
  );
}
