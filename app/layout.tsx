import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "bytemd/dist/index.css";
import { ColorSchemeScript } from "@mantine/core";
import ClientProviders from "./ClientRootProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitalsReporter } from "../components/WebVitalsReporter";
import "./globals.css";
import "./dark-mode.css";
import "./bytemd-styles.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="No'ah" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="No'ah" />
        <meta
          name="description"
          content="Sermões e Devocionais da Igreja No'ah"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7950f2" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Favicons - Ordem importa! Mais específico primeiro */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* PWA Manifest and Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="96x96"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/icons/icon-128x128.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        {/* Pré-carrega as fontes para evitar FOUC */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WebVitalsReporter />
        <ClientProviders>{children}</ClientProviders>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
