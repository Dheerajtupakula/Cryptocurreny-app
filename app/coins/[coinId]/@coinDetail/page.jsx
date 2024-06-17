"use client";

import { useContext, useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Link from "next/link";

import { StoringContext } from "@/components/GlobalContext";
import Loading from "@/app/loading";
import { RefreshContext } from "../LayoutClient";

const CoinDetail = ({ params }) => {
  const { currency } = useContext(StoringContext);
  const [coinDetail, setCoinDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useContext(RefreshContext);
  const { currencySymbol } = useContext(StoringContext);

  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-2qCYaxP26jJ7XaeUafefXSap",
      },
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetch(url, options);
        const response = await data.json();
        setCoinDetail(response);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, currency]);

  return (
    <>
      {loading && <Loading />}
      <div>
        {!loading && coinDetail && (
          <div>
            <div className="flex justify-start text-nowrap items-center">
              <img
                className="sm:size-10 max-sm:size-7 object-contain"
                src={coinDetail.image.small}
                alt=""
              />

              <div className="flex justify-center  items-center">
                <span className="font-bold text-lg p-4">{coinDetail.name}</span>
                <span className="-ml-3 text-lg">{coinDetail.symbol}</span>
              </div>
            </div>
            <div className="flex max-sm:flex-wrap justify-start gap-3 text-nowrap items-center">
              <span className="text-3xl font-bold">
                {currencySymbol}{" "}
                {parseFloat(
                  coinDetail.market_data.current_price[currency]
                ).toLocaleString()}
              </span>
              <p className="flex justify-center  items-center">
                <span>
                  {coinDetail.market_data
                    .price_change_percentage_24h_in_currency[currency] >= 0 ? (
                    <FaSortUp className="text-green-500" />
                  ) : (
                    <FaSortDown className="text-red-500" />
                  )}
                </span>
                <span className="font-semibold">
                  {currencySymbol}{" "}
                  {Math.abs(
                    coinDetail.market_data
                      .price_change_percentage_24h_in_currency[currency]
                  )}
                  %
                </span>
              </p>
            </div>
            <div className="my-3">
              <div>
                <input
                  type="range"
                  className="transparent h-1.5 sm:w-4/5 max-sm:w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                  value={coinDetail.market_data.current_price[currency]}
                  min={coinDetail.market_data.low_24h[currency]}
                  max={coinDetail.market_data.high_24h[currency]}
                  readOnly
                  name="coin-bar"
                />
              </div>
              <div className="sm:w-4/5 max-sm:w-full text-gray-700 flex items-center justify-between">
                <span className="text-sm font-bold">
                  {" "}
                  {currencySymbol}{" "}
                  {coinDetail.market_data.low_24h[currency]?.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold">24h Range</span>
                <span className="text-sm font-bold">
                  {" "}
                  {currencySymbol}{" "}
                  {coinDetail.market_data.high_24h[currency]?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="sm:w-4/5 max-sm:w-full">
              <p className="flex justify-between items-center border-b py-3 p-1">
                <span>Market Cap</span>
                <span className="font-medium">
                  {currencySymbol} {coinDetail.market_data.market_cap[currency]}
                </span>
              </p>
              <p className="flex justify-between items-center border-b sm:py-3 max-sm:py-2 p-1">
                <span>Fully Diluted Valuation</span>
                <span className="font-medium text-nowrap">
                  {currencySymbol}{" "}
                  {coinDetail.market_data.fully_diluted_valuation[currency]}
                </span>
              </p>
              <p className="flex justify-between items-center border-b sm:py-3 max-sm:py-2 p-1">
                <span>Total Volume</span>
                <span className="font-medium text-nowrap">
                  {currencySymbol}{" "}
                  {coinDetail.market_data.total_volume[currency]}
                </span>
              </p>
              <p className="flex justify-between items-center border-b sm:py-3 max-sm:py-2 p-1">
                <span>Market Cap</span>
                <span className="font-medium">
                  {currencySymbol}{" "}
                  {coinDetail.market_data.circulating_supply.toLocaleString()}
                </span>
              </p>
              <p className="flex justify-between items-center border-b sm:py-3 max-sm:py-2 p-1">
                <span>Total Supply</span>
                <span className="font-medium">
                  {currencySymbol}{" "}
                  {coinDetail.market_data.total_supply
                    ? coinDetail.market_data.total_supply?.toLocaleString()
                    : "NA"}
                </span>
              </p>
              <p className="flex justify-between items-center border-b sm:py-3 max-sm:py-2 p-1">
                <span>Max Supply</span>
                <span className="font-medium">
                  {currencySymbol}{" "}
                  {coinDetail.market_data.max_supply?.toLocaleString() ?? "N/A"}
                </span>
              </p>
            </div>
            <div className="sm:w-4/5 mt-2 bg-slate-100 p-2 rounded-lg max-sm:w-full">
              <h3 className="mb-2">Info</h3>
              <div className="flex justify-between items-center">
                <span>Website</span>
                <span className="flex gap-2">
                  <Link
                    className="p-2 text-[9px] font-semibold bg-slate-300 rounded-lg"
                    href={coinDetail.links.homepage[0]}
                    target="_blank"
                  >
                    {params.coinId}.org
                  </Link>
                  <Link
                    className="p-2 text-[9px] font-semibold bg-slate-300 rounded-lg"
                    href={coinDetail.links.homepage[0]}
                  >
                    whitepaper
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default CoinDetail;
