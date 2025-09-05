// app/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Roboto, Nunito_Sans } from "next/font/google";
import "./globals.css";

// Client-side providers
import { Providers } from "@/components/providers";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Suite",
  description: "Premium business management platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={nunitoSans.className} >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
