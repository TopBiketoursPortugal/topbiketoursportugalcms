/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="@vite-pwa/assets-generator/virtual" />
/// <reference types="vite-plugin-pwa/pwa-assets" />

declare module '@bookshop/astro-bookshop' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookshop: any; // Replace `any` with specific types if you know them
  export default bookshop;
}

declare namespace App {
  interface Locals {
    // Headings of the page being rendered, for the table-of-contents block
    // (page-sections/guide/table-of-contents). Set by src/layouts/Guide.astro
    // and, for long posts, src/layouts/Post.astro — so a block dropped into
    // the page finds them without being wired up by hand.
    tocHeadings?: import('src/types').TocHeading[];
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Record<string, any>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // Set by CloudCannon's editor bundle when the Visual Editor is active.
    inEditorMode?: boolean;
  }
}
