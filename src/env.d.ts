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

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}
