import type React from "react"
import type { Metadata } from "next"
import {
  Roboto,
  Nunito_Sans,
} from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

// Sans-serif fonts
export const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })
export const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })


export const metadata: Metadata = {
  title: "Luxe Suite",
  description: "Premium business management platform"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunitoSans.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
