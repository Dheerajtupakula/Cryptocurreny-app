"use client";

import { createContext, useState } from "react";

export const CurrencyContext = createContext();
export const SortingContext = createContext();

export const GlobalContext = ({ children }) => {
  const [sortOption, setSortOption] = useState("market_cap_asc");

  const [currency, setCurrency] = useState("usd");
  // const [currency, setCurrency] = useState(() => {
  //   const savedCurrency = localStorage.getItem("currency");
  //   return savedCurrency || "usd";
  // });
  return (
    <CurrencyContext.Provider value={[currency, setCurrency]}>
      <SortingContext.Provider value={[sortOption, setSortOption]}>
        {children}
      </SortingContext.Provider>
    </CurrencyContext.Provider>
  );
};
