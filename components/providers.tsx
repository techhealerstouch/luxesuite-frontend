"use client";

import { ReactNode } from "react";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/components/auth-provider";
import { IntlProvider } from "react-intl";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="en-US">
      <CurrencyProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </CurrencyProvider>
    </IntlProvider>
  );
}
