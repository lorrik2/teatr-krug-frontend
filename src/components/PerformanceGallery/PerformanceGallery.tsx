"use client";

import OptimizedImage from "@/components/OptimizedImage";
import styles from "./PerformanceGallery.module.css";

function toEmbedUrl(url: string): string {
  if (url.includes("vk.com/video_ext.php")) return url;
  if (url.includes("youtube.com/embed/")) return url;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function PerformanceGallery({
  images,
  teaserUrl,
}: {
  images: string[];
  teaserUrl?: string;
}) {
  return (
    <div className={styles.gallery}>
      <div className={styles.videoWrap}>
        {teaserUrl ? (
          <iframe
            src={toEmbedUrl(teaserUrl)}
            title="Тизер спектакля"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.video}
          />
        ) : (
          <div className={styles.teaserPlaceholder}>
            <span className={styles.teaserPlaceholderText}>
              Тизер спектакля
            </span>
          </div>
        )}
      </div>
      {images.map((src, i) => (
        <div key={i} className={styles.imgWrap}>
          <OptimizedImage
            src={src}
            alt={`Фото спектакля ${i + 1}`}
            width={800}
            height={600}
            className={styles.img}
            effect="blur"
          />
        </div>
      ))}
    </div>
  );
}
