import Image from "next/image";
import styles from "./image-card.module.scss";

type ImageCardProps = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  priority?: boolean;
};

const blurPlaceholder =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23d9bc8f'/%3E%3Cstop offset='1' stop-color='%231f4437'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='900' fill='url(%23a)'/%3E%3C/svg%3E";

export function ImageCard({
  src,
  alt,
  label,
  caption,
  priority = false,
}: ImageCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.media}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={styles.image}
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          sizes="(max-width: 980px) 100vw, 50vw"
        />
      </div>
      <div className={styles.overlay}>
        <span>{label}</span>
        <p>{caption}</p>
      </div>
    </div>
  );
}
