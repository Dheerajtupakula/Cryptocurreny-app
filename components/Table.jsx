"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { IoStar, IoStarOutline } from "react-icons/io5";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { StoringContext } from "./GlobalContext";

const Table = ({ coinData, page, toDisplay, isDisable }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [myCoins, setMyCoins] = useState([]);
  const { currencySymbol } = useContext(StoringContext);
  const router = useRouter();
  const isFavorite = (coinId) => myCoins.includes(coinId);

  const handleCoinClick = (coinId) => {
    router.push(`/coins/${coinId}`);
  };

  useEffect(() => {
    if (session) {
      const fetchFavoriteCoins = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/favorite");

          if (response.ok) {
            const favoriteCoins = await response.json();
            setMyCoins(favoriteCoins.map((coin) => coin.coinId));
          } else {
            console.error("Failed to fetch favorite coins");
          }
        } catch (error) {
          console.error("Error while fetching favorite coins:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFavoriteCoins();
    }
  }, []);

  const handleAddToFavourite = async (coinId, coinName) => {
    if (session) {
      const userEmail = session.user.email;

      try {
        const response = await fetch("/api/favorite", {
          method: isFavorite(coinId) ? "DELETE" : "POST",
          // method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, coinId, coinName }),
        });

        if (response.ok) {
          const updatedFavorites = await response.json();
          setMyCoins(updatedFavorites?.map((coin) => coin.coinId));
        } else {
          console.log("Failed to update favorite coins");
          alert('Message: "Login to add to favorite"');
        }
      } catch (error) {
        console.error("Error while updating favorite coins:", error);
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <table className="w-full overflow-auto">
          <thead>
            <tr>
              <th className="p-2 sticky left-0 min-w-28 bg-slate-200">Coin</th>
              <th className=" bg-slate-200">Price</th>
              <th className="p-2 text-nowrap  bg-slate-200">
                Price Change 24h
              </th>
              <th className="p-2 text-nowrap  bg-slate-200">Market Cap</th>
              <th className="p-2 text-nowrap  bg-slate-200">Total Volume</th>
            </tr>
          </thead>
          <tbody className="py-4">
            {
              // .slice(page * toDisplay - toDisplay, page * toDisplay)
              coinData.map((coin, index) => (
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
                    <span className="flex pl-3 gap-3 justify-center text-center w-full items-center">
                      <div
                        className={`${isDisable ? " " : "hidden"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavourite(coin.id, coin.name);
                        }}
                      >
                        {isFavorite(coin.id) ? (
                          <span className="text-yellow-500 text-xl">
                            <IoStar />
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xl">
                            <IoStarOutline />
                          </span>
                        )}
                      </div>
                      <img
                        className="object-contain"
                        src={coin.image}
                        width={30}
                        height={30}
                        alt="coin-Image"
                      />
                      <div className="flex flex-col">
                        <span className="text-bold text-lg">{coin.name}</span>
                        <span className="text-small text-sm">
                          {coin.symbol}
                        </span>
                      </div>
                    </span>
                  </td>
                  <td>
                    <p className="text-nowrap">
                      {!coin.current_price
                        ? ""
                        : (currencySymbol ? currencySymbol : "") + " "}{" "}
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
                      <span
                        className={` font-semibold ${
                          coin.price_change_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {" "}
                        {!coin.current_price
                          ? ""
                          : (currencySymbol ? currencySymbol : "") + " "}{" "}
                        {coin.price_change_24h >= 0
                          ? parseFloat(
                              coin.price_change_24h?.toFixed(6).toLocaleString()
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
                        : (currencySymbol ? currencySymbol : "") + " "}{" "}
                      {coin.market_cap?.toLocaleString("en-US")}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center text-nowrap">
                      {!coin.current_price
                        ? ""
                        : (currencySymbol ? currencySymbol : "") + " "}{" "}
                      {coin.total_volume?.toLocaleString("en-US")}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </>
  );
};

export default Table;
