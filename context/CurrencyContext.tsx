"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "PHP",
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState("PHP");

  useEffect(() => {
    // Auto-detect currency from browser locale
    const userLocale = navigator.language; // e.g., "en-PH" or "en-US"
    const localeToCurrency: Record<string, string> = {
      "en-PH": "PHP",
      "en-US": "USD",
      "en-GB": "GBP",
    };
    setCurrency(localeToCurrency[userLocale] || "USD");
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
