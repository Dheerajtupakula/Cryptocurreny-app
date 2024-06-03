"use client";

import React, { useState, createContext } from "react";

export const RefreshContext = createContext();

export default function LayoutClient({ children, coinDetail, coinGraph }) {
  const [refresh, setRefresh] = useState(1);

  return (
    <RefreshContext.Provider value={[refresh, setRefresh]}>
      <section className="max-sm:-mt-[11px]">
        {children}
        <div className="grid sm:grid-cols-2 sm:mx-9 max-sm:mx-3 max-sm:gap-4 max-sm:grid-cols-1 p-3 justify-center items-center">
          {coinDetail}
          {coinGraph}
        </div>
      </section>
    </RefreshContext.Provider>
  );
}
