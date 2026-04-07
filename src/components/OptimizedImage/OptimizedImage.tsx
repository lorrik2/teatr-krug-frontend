"use client";

/// <reference path="../../types/react-lazy-load-image-component.d.ts" />
import { useState } from "react";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./OptimizedImage.module.css";

export type OptimizedImageProps = ImageProps & {
  /** Загрузить сразу, без lazy (для above-the-fold: hero, первый слайд) */
  priority?: boolean;
  /** Эффект из react-lazy-load-image-component: blur, opacity, black-and-white */
  effect?: "blur" | "opacity" | "black-and-white";
  /** Не показывать shimmer placeholder (для логотипов) */
  skipShimmer?: boolean;
};

/** Извлекает URL строку из src (string | StaticImageData | StaticRequire) */
function getSrcString(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  const data = "default" in src ? src.default : src;
  return (data as StaticImageData).src;
}

const fillStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

/**
 * Единый компонент для всех изображений.
 * - priority={true} → Next.js Image (мгновенная загрузка)
 * - priority={false} → Lazy load через Intersection Observer
 * - effect="blur" | "opacity" | "black-and-white" → LazyLoadImage с эффектом по документации пакета
 *
 * При effect используется LazyLoadImage. Поддерживается и fill (обёртка с position: absolute).
 * Зависимость react-lazy-load-image-component изолирована только здесь.
 */
export default function OptimizedImage({
  priority = false,
  effect,
  skipShimmer = false,
  ...imageProps
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const srcStr =
    typeof imageProps.src === "string"
      ? imageProps.src
      : getSrcString(imageProps.src);
  if (!srcStr || srcStr.trim() === "") {
    return (
      <div
        className={imageProps.className as string}
        style={{
          ...(imageProps.fill ? fillStyle : {}),
          ...(typeof imageProps.style === "object" ? imageProps.style : {}),
          backgroundColor: "var(--graphite-200, #e5e7eb)",
        }}
        aria-hidden
      />
    );
  }

  if (priority) {
    if (skipShimmer) {
      return <Image {...imageProps} alt={imageProps.alt ?? ""} priority />;
    }
    return (
      <div
        className={styles.wrapper}
        style={
          imageProps.fill
            ? fillStyle
            : { position: "relative", display: "inline-block" }
        }
      >
        <div
          className={`${styles.skeleton} ${loaded ? styles.loaded : ""}`}
          aria-hidden
        />
        <Image
          {...imageProps}
          alt={imageProps.alt ?? ""}
          priority
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }

  const fill = imageProps.fill ?? false;
  const hasDimensions = imageProps.width != null && imageProps.height != null;

  if (effect && hasDimensions) {
    const imgStyle =
      typeof imageProps.style === "object" && imageProps.style
        ? { ...imageProps.style }
        : undefined;
    if (skipShimmer) {
      return (
        <LazyLoadImage
          src={getSrcString(imageProps.src)}
          alt={imageProps.alt ?? ""}
          width={imageProps.width}
          height={imageProps.height}
          className={imageProps.className as string}
          style={imgStyle}
          effect={effect}
          threshold={150}
          useIntersectionObserver
        />
      );
    }
    return (
      <div
        className={styles.wrapper}
        style={{
          position: "relative",
          display: "inline-block",
          width: imageProps.width,
          height: imageProps.height,
        }}
      >
        <div
          className={`${styles.skeleton} ${loaded ? styles.loaded : ""}`}
          aria-hidden
        />
        <LazyLoadImage
          src={getSrcString(imageProps.src)}
          alt={imageProps.alt ?? ""}
          width={imageProps.width}
          height={imageProps.height}
          className={imageProps.className as string}
          style={imgStyle}
          effect={effect}
          threshold={150}
          useIntersectionObserver
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }

  if (effect && fill) {
    const imgStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...(typeof imageProps.style === "object" && imageProps.style
        ? { objectFit: imageProps.style.objectFit, objectPosition: imageProps.style.objectPosition }
        : {}),
    };
    if (imgStyle.objectFit == null) imgStyle.objectFit = "cover";
    const lazyFill = (
      <LazyLoadImage
        src={getSrcString(imageProps.src)}
        alt={imageProps.alt ?? ""}
        width={16}
        height={9}
        effect={effect}
        threshold={150}
        useIntersectionObserver
        onLoad={skipShimmer ? undefined : () => setLoaded(true)}
        wrapperProps={{ style: fillStyle }}
        style={imgStyle}
      />
    );
    if (skipShimmer) {
      return (
        <div
          className={imageProps.className as string}
          style={{
            ...fillStyle,
            ...(typeof imageProps.style === "object" ? imageProps.style : {}),
          }}
        >
          {lazyFill}
        </div>
      );
    }
    return (
      <div
        className={`${styles.wrapper} ${(imageProps.className as string) ?? ""}`}
        style={{
          ...fillStyle,
          ...(typeof imageProps.style === "object" ? imageProps.style : {}),
        }}
      >
        <div
          className={`${styles.skeleton} ${loaded ? styles.loaded : ""}`}
          aria-hidden
        />
        {lazyFill}
      </div>
    );
  }

  /* Next.js Image уже поддерживает lazy loading изображений, без задержки рендера блока */
  if (skipShimmer) {
    return <Image {...imageProps} alt={imageProps.alt ?? ""} />;
  }
  return (
    <div
      className={styles.wrapper}
      style={
        imageProps.fill
          ? fillStyle
          : { position: "relative", display: "inline-block" }
      }
    >
      <div
        className={`${styles.skeleton} ${loaded ? styles.loaded : ""}`}
        aria-hidden
      />
      <Image
        {...imageProps}
        alt={imageProps.alt ?? ""}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
