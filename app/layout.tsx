// app/layout.tsx
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Playfair_Display, Inter } from "next/font/google";
import { Metadata } from "next";
import ClientProviders from "./ClientRootProvider";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meu App",
  description: "Dashboard com Mantine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      {...mantineHtmlProps}
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
