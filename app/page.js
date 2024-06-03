"use client";

import { useContext, useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { IoRefreshOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";
import { CurrencyContext, SortingContext } from "@/components/GlobalContext";
import { vs_currency } from "./api/vs_currencies";
import Loading from "./loading";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState([]);
  const [currency, setCurrency] = useContext(CurrencyContext);
  const [sortOption, setSortOption] = useContext(SortingContext);
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const toDisplay = 10;
  const router = useRouter();

  const handlePrevBtn = () => {
    if (page === 0) {
      setPage(1);
    } else if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleNextBtn = () => {
    if (page < coinData.length / toDisplay) {
      setPage((prev) => prev + 1);
    }
  };
  const RefreshHandle = () => {
    setRefresh((prev) => prev + 1);
  };
  const handleCoinClick = (coinId) => {
    router.push(`/${coinId}`);
  };
  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${sortOption}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-2qCYaxP26jJ7XaeUafefXSap",
      },
    };
    const fetchData = async () => {
      setLoading(true);
      const data = await fetch(url, options);
      const response = await data.json();
      setCoinData(response);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      console.log("feteched");
    };

    fetchData();
  }, [refresh, currency, sortOption]);

  return (
    <>
      {loading && <Loading />}
      {!loading && coinData && (
        <section className="w-full relative">
          <SideBar />
          <div className="w-full max-sm:mt-2 overflow-hidden bg-slate-200 mb-12 overflow-x-auto">
            <table className="w-full overflow-x-auto">
              <thead>
                <tr>
                  <th className="p-2 sticky left-0 min-w-28  bg-slate-200">
                    Coin
                  </th>
                  <th>Price</th>
                  <th className="p-2 text-nowrap">Price Change 24h</th>
                  <th className="p-2 text-nowrap">Market Cap</th>
                  <th className="p-2 text-nowrap">Total Volume</th>
                </tr>
              </thead>
              <tbody className="py-4">
                {coinData
                  .slice(page * toDisplay - toDisplay, page * toDisplay)
                  .map((coin, index) => (
                    <tr
                      onClick={() => handleCoinClick(coin.id)}
                      key={coin.id}
                      className={`cursor-pointer ${
                        index % 2 == 0 ? "bg-slate-300" : "bg-slate-200"
                      }`}
                    >
                      <td
                        className={`sticky left-0 px-6 p-0   sm:p-1 ${
                          index % 2 == 0 ? "bg-slate-300" : "bg-slate-200"
                        }`}
                      >
                        <div className="flex pl-3 gap-3 justify-center text-center w-full items-center">
                          <img
                            className="object-contain"
                            src={coin.image}
                            width={30}
                            height={30}
                            alt="coin-Image"
                          />
                          <div className="flex flex-col">
                            <span className="text-bold text-lg">
                              {coin.name}
                            </span>
                            <span className="text-small text-sm">
                              {coin.symbol}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="pl-2 flex justify-center items-center text-nowrap">
                          {!coin.current_price
                            ? ""
                            : vs_currency.filter(
                                (sybl) => sybl.name === currency
                              )[0].symbol + " "}{" "}
                          {coin.current_price?.toLocaleString()}
                        </p>
                      </td>
                      <td>
                        <p className="flex gap-2 justify-center items-center">
                          {coin.price_change_24h >= 0 ? (
                            <FaSortUp className="text-green-500" />
                          ) : (
                            <FaSortDown className="text-red-500" />
                          )}
                          <span>
                            {" "}
                            {!coin.current_price
                              ? ""
                              : vs_currency.filter(
                                  (sybl) => sybl.name === currency
                                )[0].symbol + " "}{" "}
                            {coin.price_change_24h >= 0
                              ? parseFloat(
                                  coin.price_change_24h
                                    ?.toFixed(6)
                                    .toLocaleString()
                                )
                              : Math.abs(
                                  parseFloat(
                                    coin.price_change_24h
                                      ?.toFixed(6)
                                      .toLocaleString()
                                  )
                                )}
                          </span>
                        </p>
                      </td>
                      <td>
                        <div className="flex justify-center items-center text-nowrap">
                          {!coin.current_price
                            ? ""
                            : vs_currency.filter(
                                (sybl) => sybl.name === currency
                              )[0].symbol + " "}{" "}
                          {coin.market_cap?.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center text-nowrap">
                          {!coin.current_price
                            ? ""
                            : vs_currency.filter(
                                (sybl) => sybl.name === currency
                              )[0].symbol + " "}{" "}
                          {coin.total_volume.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-0 w-full flex justify-between items-center text-white p-3 bg-slate-900">
            <div>
              <button type="button" onClick={handlePrevBtn}>
                prev
              </button>
            </div>

            <div>
              page: {page} of{" "}
              {Math.round(
                (coinData.length / toDisplay) % 2 !== 0
                  ? coinData.length / toDisplay + 1
                  : coinData.length / toDisplay
              )}
            </div>

            <div>
              <button type="button" onClick={handleNextBtn}>
                next
              </button>
            </div>
          </div>
          <div className="fixed bottom-14 right-2">
            <button
              onClick={RefreshHandle}
              className="flex justify-center items-center gap-2  p-2 rounded-lg bg-slate-500/25 hover:bg-slate-400 text-white"
            >
              <span>
                <IoRefreshOutline />
              </span>
              <span>Refresh</span>
            </button>
          </div>
        </section>
      )}
    </>
  );
};
export default Home;
