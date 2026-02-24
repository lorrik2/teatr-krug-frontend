declare module "react-lazy-load-image-component" {
  import type { ImgHTMLAttributes, ReactNode } from "react";

  export interface LazyLoadComponentProps {
    children: ReactNode;
    threshold?: number;
    useIntersectionObserver?: boolean;
    visibleByDefault?: boolean;
  }

  export const LazyLoadComponent: React.FC<LazyLoadComponentProps>;

  export interface LazyLoadImageProps
    extends ImgHTMLAttributes<HTMLImageElement> {
    effect?: "blur" | "opacity" | "black-and-white";
    threshold?: number;
    useIntersectionObserver?: boolean;
    visibleByDefault?: boolean;
    wrapperClassName?: string;
    wrapperProps?: Record<string, unknown>;
    placeholder?: ReactNode;
    placeholderSrc?: string;
  }

  export const LazyLoadImage: React.FC<LazyLoadImageProps>;
}
