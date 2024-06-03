"use client";

import { useContext } from "react";
import { SortingContext } from "./GlobalContext";

const SideBar = () => {
  const [sortOption, setSortOption] = useContext(SortingContext);

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
        <label className="mr-4 text-nowrap">
          <input
            type="radio"
            name="sortOption"
            value="market_cap_asc"
            checked={sortOption === "market_cap_asc"}
            onChange={handleSortOptionChange}
            className="radiobutton ml-3"
          />
          marketcap_Asc
        </label>
        <label className="mr-4 text-nowrap">
          <input
            type="radio"
            name="sortOption"
            value="market_cap_desc"
            checked={sortOption === "market_cap_desc"}
            onChange={handleSortOptionChange}
            className="radiobutton ml-3"
          />
          marketcap_Desc
        </label>
        <label className="mr-4 text-nowrap">
          <input
            type="radio"
            name="sortOption"
            value="volume_asc"
            checked={sortOption === "volume_asc"}
            onChange={handleSortOptionChange}
            className="radiobutton ml-3"
          />
          <span>volume_Asc</span>
        </label>
        <label className="mr-4 text-nowrap">
          <input
            type="radio"
            name="sortOption"
            value="volume_desc"
            checked={sortOption === "volume_desc"}
            onChange={handleSortOptionChange}
            className="radiobutton ml-3"
          />
          volume_Desc
        </label>
      </div>
    </div>
  );
};

export default SideBar;
