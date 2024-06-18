"use client";

import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { vs_currency } from "@/app/api/vs_currencies";
import { CoinDataContext, StoringContext } from "./GlobalContext";
import { IoRefreshOutline } from "react-icons/io5";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const { currency, setCurrency } = useContext(StoringContext);
  const { coinData } = useContext(CoinDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { setRefresh } = useContext(CoinDataContext);

  const { data: session } = useSession();

  const handleSearch = (event) => {
    const searchInput = event.target.value;
    setSearch(searchInput);

    const filteredData = coinData.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (searchInput.length > 0) {
      setSearchResults(filteredData);
    } else {
      setSearchResults([]);
    }
  };
  const handleCoinClickLg = () => {
    setSearch("");
    setSearchResults([]);
    setIsOpen(!isOpen);
  };

  const handleCoinClickSm = () => {
    setSearch("");
    setSearchResults([]);
    setIsOpen(!isOpen);
  };

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };
  const handleCloseMenu = () => {
    toggleMenu();
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const RefreshHandle = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <nav className="w-full fixed top-0 p-2 px-4 z-40 bg-slate-400 flex justify-between items-center">
      <div>
        <Link href="/">
          <img
            className="content-cover"
            src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div className="flex gap-2">
        <button
          onClick={RefreshHandle}
          className="flex justify-center items-center gap-2 p-1 sm:px-3 rounded-full bg-slate-600/50 hover:bg-slate-400 text-white"
        >
          <span>
            <IoRefreshOutline />
          </span>
          <span className="max-sm:hidden">Refresh</span>
        </button>

        {/*large Screen only */}
        <div className="flex gap-2 justify-center items-center max-sm:hidden">
          <div className="relative">
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Search here ..."
              className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-full border-neutral-300 ring-offset-background placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchResults && searchResults.length > 0 && (
              <div className="absolute top-12 right-0 max-h-[300px] p-3 grid gap-2  overflow-y-auto min-w-[280px] max-w-xl bg-slate-100 rounded-md">
                {searchResults.map((coin) => (
                  <Link
                    key={coin.id}
                    href={`/coins/${coin.id}`}
                    onClick={handleCoinClickLg}
                    className="flex justify-between gap-3 items-center"
                  >
                    <div className="flex gap-2 ">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-5 h-5 object-cover"
                      />
                      <p className="text-sm  min-w-sm">{coin.name}</p>
                    </div>
                    <p className="text-sm text-nowrap">
                      {!coin.current_price
                        ? ""
                        : vs_currency.filter(
                            (sybl) => sybl.name === currency
                          )[0].symbol + " "}
                      {coin.current_price}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <select
            className="outline-none rounded-full p-2 px-3"
            id="currency"
            value={currency}
            onChange={handleCurrency}
          >
            {vs_currency.map((curr) => (
              <option key={curr.name} value={curr.name}>
                {curr.name}
              </option>
            ))}
          </select>
          <div>
            {session && (
              <Link href="/profile">
                <button className="font-semibold p-2 bg-slate-600 text-white hover:bg-slate-800 rounded-full px-4 text-sm">
                  {session.user.email.split("@")[0]}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/*small Screen only */}
        <div className="sm:hidden max-sm:flex relative">
          <div>
            <button className="" onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            {isOpen && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1 grid gap-2 justify-center p-2" role="none">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search here .."
                      value={search}
                      onChange={handleSearch}
                      className="flex w-full h-10 px-3 py-2 text-sm bg-white border  rounded-full border-neutral-300 ring-offset-background placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {/*show results when the user search */}
                    {searchResults && searchResults.length > 0 && (
                      <div className="absolute top-12 right-0 max-h-[300px] p-3 grid gap-2  overflow-y-auto min-w-[280px] max-w-xl bg-slate-100 rounded-md">
                        {searchResults.map((coin) => (
                          <Link
                            key={coin.id}
                            href={`/coins/${coin.id}`}
                            onClick={handleCoinClickSm}
                            className="flex justify-between gap-3 items-center"
                          >
                            <div className="flex gap-2 ">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-5 h-5 object-cover"
                              />
                              <p className="text-sm  min-w-sm">{coin.name}</p>
                            </div>
                            <p className="text-sm text-nowrap">
                              {!coin.current_price
                                ? ""
                                : vs_currency.filter(
                                    (sybl) => sybl.name === currency
                                  )[0].symbol + " "}
                              {coin.current_price}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <select
                    className="outline-none rounded-full p-2 px-3 flex justify-between"
                    id="currency"
                    value={currency}
                    onChange={(e) => {
                      handleCurrency(e);
                      handleCloseMenu();
                    }}
                  >
                    {vs_currency.map((curr) => (
                      <option key={curr.name} value={curr.name}>
                        {curr.name}
                      </option>
                    ))}
                  </select>
                  <div onClick={toggleMenu}>
                    {session && (
                      <Link href="/profile">
                        <button className="font-semibold w-full p-2 bg-slate-600 text-white hover:bg-slate-800 rounded-full px-4 text-sm">
                          Profile
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
