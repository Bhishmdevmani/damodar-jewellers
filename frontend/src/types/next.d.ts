// Type declarations for Next.js modules
declare module 'next' {
  export type Metadata = {
    title?: any;
    description?: string;
    keywords?: string[];
    openGraph?: any;
    robots?: any;
    [key: string]: any;
  };
  export type NextConfig = Record<string, any>;
  export type ResolvingMetadata = Promise<Metadata>;
  export type ResolvingViewport = any;
  const next: any;
  export default next;
}

declare module 'next/link' {
  import React from 'react';
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string | any;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
  }
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(url: string): void;
  };
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
  export function notFound(): never;
}

declare module 'next/font/google' {
  export interface FontOptions {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: string;
    variable?: string;
    preload?: boolean;
  }
  export function Cormorant_Garamond(options?: FontOptions): { className: string; variable: string };
  export function Manrope(options?: FontOptions): { className: string; variable: string };
}

declare module 'next/types.js' {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  export type * from 'next';
}

declare module 'next/server' {
  export class NextResponse {
    static json(body: any, init?: any): any;
    static redirect(url: string | URL, status?: number): any;
  }
  export class NextRequest {}
}

declare module 'next/server.js' {
  export * from 'next/server';
}
