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
  const [currency, setCurrencyState] = useState("PHP");

  // Save to localStorage whenever it changes
  const setCurrency = (c: string) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", c);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user already selected a currency
      const storedCurrency = localStorage.getItem("currency");
      if (storedCurrency) {
        setCurrencyState(storedCurrency);
      } else {
        // Fallback: auto-detect from locale if nothing saved
        const userLocale = navigator.language; // e.g., "en-PH" or "en-US"
        const localeToCurrency: Record<string, string> = {
          "en-PH": "PHP",
          "en-US": "USD",
          "en-GB": "GBP",
        };
        setCurrencyState(localeToCurrency[userLocale] || "PHP");
      }
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
