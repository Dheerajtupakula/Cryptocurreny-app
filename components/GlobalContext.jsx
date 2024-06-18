"use client";

import { createContext, useEffect, useState } from "react";
import { vs_currency } from "@/app/api/vs_currencies";

export const StoringContext = createContext();

export const CoinDataContext = createContext();

export const GlobalContext = ({ children }) => {
  const [sortOption, setSortOption] = useState("market_cap_desc");
  const [currency, setCurrency] = useState(() => {
    const savedCurrency =
      typeof localStorage !== "undefined" && localStorage.getItem("currency");
    return savedCurrency || "usd";
  });
  const [coinData, setCoinData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("");
  // Api request...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${sortOption}&per_page=250`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            // "x-cg-demo-api-key": process.env.X_CG_DEMO_API_KEY,
            "x-cg-demo-api-key": "CG-2qCYaxP26jJ7XaeUafefXSap",
          },
        };
        setLoading(true);

        const response = await fetch(url, options);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCoinData(data);
        } else {
          setCoinData([]);
          console.log("Expected array but got:", data);
        }
      } catch (error) {
        console.log("Error: ", error);
        setCoinData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, currency, sortOption]);
  // symbol...
  useEffect(() => {
    const symbol = vs_currency.filter((sybl) => sybl.name === currency)[0]
      ?.symbol;
    setCurrencySymbol(symbol);
  }, [vs_currency, currency]);
  // currency change in localStorage...
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("currency", currency);
      } catch (error) {
        console.error("Failed to set currency in localStorage:", error);
        localStorage.removeItem("currency");
        alert("Failed to save currency selection. Please try again later.");
      }
    }
  }, [currency]);

  return (
    <StoringContext.Provider
      value={{
        currency,
        setCurrency,
        sortOption,
        setSortOption,
        currencySymbol,
      }}
    >
      <CoinDataContext.Provider value={{ coinData, setRefresh, loading }}>
        {children}
      </CoinDataContext.Provider>
    </StoringContext.Provider>
  );
};
