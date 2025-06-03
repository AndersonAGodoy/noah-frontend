import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import ClientProviders from "./ClientRootProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

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
        {/* Pré-carrega as fontes para evitar FOUC */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
