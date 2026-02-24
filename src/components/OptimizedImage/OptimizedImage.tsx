"use client";

/// <reference path="../../types/react-lazy-load-image-component.d.ts" />
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export type OptimizedImageProps = ImageProps & {
  /** Загрузить сразу, без lazy (для above-the-fold: hero, первый слайд) */
  priority?: boolean;
  /** Эффект из react-lazy-load-image-component: blur, opacity, black-and-white */
  effect?: "blur" | "opacity" | "black-and-white";
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
  ...imageProps
}: OptimizedImageProps) {
  if (priority) {
    return <Image {...imageProps} priority />;
  }

  const fill = imageProps.fill ?? false;
  const hasDimensions =
    imageProps.width != null && imageProps.height != null;

  if (effect && hasDimensions) {
    return (
      <LazyLoadImage
        src={getSrcString(imageProps.src)}
        alt={imageProps.alt ?? ""}
        width={imageProps.width}
        height={imageProps.height}
        className={imageProps.className as string}
        effect={effect}
        threshold={150}
        useIntersectionObserver
      />
    );
  }

  if (effect && fill) {
    const objectFit =
      typeof imageProps.style === "object" &&
      imageProps.style &&
      "objectFit" in imageProps.style
        ? imageProps.style.objectFit
        : "cover";
    return (
      <div
        className={imageProps.className as string}
        style={{
          ...fillStyle,
          ...(typeof imageProps.style === "object" ? imageProps.style : {}),
        }}
      >
        <LazyLoadImage
          src={getSrcString(imageProps.src)}
          alt={imageProps.alt ?? ""}
          width={16}
          height={9}
          effect={effect}
          threshold={150}
          useIntersectionObserver
          wrapperProps={{
            style: fillStyle,
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: objectFit as React.CSSProperties["objectFit"],
          }}
        />
      </div>
    );
  }

  /* Next.js Image уже поддерживает lazy loading изображений, без задержки рендера блока */
  return <Image {...imageProps} />;
}
