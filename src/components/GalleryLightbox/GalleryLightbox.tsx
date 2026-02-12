"use client";

import Image from "next/image";
import useFancybox from "@/hooks/useFancybox";
import styles from "./GalleryLightbox.module.css";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  /** Вариант: grid для страницы О театре, slider для блока About */
  variant?: "grid" | "slider";
}

export default function GalleryLightbox({
  images,
  variant = "grid",
}: GalleryLightboxProps) {
  const [fancyboxRef] = useFancybox();

  return (
    <ul
      ref={fancyboxRef}
      className={variant === "grid" ? styles.galleryGrid : styles.galleryList}
    >
      {images.map((img, i) => (
        <li key={i}>
          <a
            href={img.src}
            data-fancybox="gallery"
            data-caption={`${img.alt} (${i + 1}/${images.length})`}
            className={styles.thumbBtn}
            aria-label={`Открыть фото: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={500}
              className={styles.thumbImg}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
