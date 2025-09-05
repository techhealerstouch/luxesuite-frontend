"use client";

import React, { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import { useCurrency } from "@/context/CurrencyContext";

interface CurrencyProps {
  amount: number;
  from?: string;
}

const API_KEY = "e6f3f9521db5947c9060d3ed"; // replace with your actual API key

export const Currency: React.FC<CurrencyProps> = ({ amount, from = "PHP" }) => {
  const { currency: targetCurrency } = useCurrency();
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchConversion() {
      if (from === targetCurrency) {
        setConvertedAmount(amount);
        return;
      }

      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
        );
        const data = await res.json();

        if (data.result === "success" && data.conversion_rates?.[targetCurrency]) {
          const rate = data.conversion_rates[targetCurrency];
          setConvertedAmount(amount * rate);
        } else {
          console.warn("Conversion rate not found, using original amount");
          setConvertedAmount(amount);
        }
      } catch (error) {
        console.error("Currency conversion failed:", error);
        setConvertedAmount(amount);
      }
    }

    fetchConversion();
  }, [amount, from, targetCurrency]);

  if (convertedAmount === null) return <span>Loading...</span>;

  return (
    <FormattedNumber
      value={convertedAmount}
      style="currency"
      currency={targetCurrency}
      minimumFractionDigits={2}
    />
  );
};
