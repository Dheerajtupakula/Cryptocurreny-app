"use client";

import { RadioButton } from "primereact/radiobutton";

import { useContext } from "react";
import { StoringContext } from "./GlobalContext";

const SideBar = () => {
  const { sortOption, setSortOption } = useContext(StoringContext);

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };
  return (
    <div className="flex max-sm:-m-[12px] justify-center items-center min-sm:my-4 bg-slate-300 h-12">
      {/* Dropdown for small screens */}
      <div className="sm:hidden">
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={handleSortOptionChange}
          className="outline-none rounded p-1"
        >
          <option value="market_cap_asc">marketcap_Asc</option>
          <option value="market_cap_desc">marketcap_Desc</option>
          <option value="volume_asc">volume_Asc</option>
          <option value="volume_desc">volume_Desc</option>
        </select>
      </div>

      {/* Radio buttons for larger screens */}
      <div className="hidden sm:flex items-center">
        <label className="mr-2">Sort by: </label>
        <div className="flex flex-wrap gap-3">
          <div className="flex align-items-center">
            <RadioButton
              inputId="sortOption1"
              name="sorting"
              value="market_cap_asc"
              onChange={(e) => setSortOption(e.value)}
              checked={sortOption === "market_cap_asc"}
            />
            <label htmlFor="sortOption1" className="ml-2">
              MarketCap_asc
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              className="text-xl"
              inputId="sortOption2"
              name="sorting"
              value="market_cap_desc"
              onChange={(e) => setSortOption(e.value)}
              checked={sortOption === "market_cap_desc"}
            />
            <label htmlFor="sortOption2" className="ml-2">
              MarketCap_desc
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              className="text-xl"
              inputId="sortOption3"
              name="sorting"
              value="volume_asc"
              onChange={(e) => setSortOption(e.value)}
              checked={sortOption === "volume_asc"}
            />
            <label htmlFor="sortOption3" className="ml-2">
              Volume_asc
            </label>
          </div>
          <div className="flex align-items-center">
            <RadioButton
              inputId="sortOption4"
              name="sorting"
              value="volume_desc"
              onChange={(e) => setSortOption(e.value)}
              checked={sortOption === "volume_desc"}
            />
            <label htmlFor="sortOption4" className="ml-2">
              Volume_desc
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
