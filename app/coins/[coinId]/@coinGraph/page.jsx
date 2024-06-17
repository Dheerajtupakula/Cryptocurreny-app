// const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}/ohlc?vs_currency=${currency}&days=${days}`;
// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     "x-cg-demo-api-key": "CG-2qCYaxP26jJ7XaeUafefXSap",
//   },
// };
// const fetchData = async () => {
//   setLoading(true);
//   const data = await fetch(url, options);
//   const response = await data.json();
//   setGraphData(response);
//   setTimeout(() => {
//     setLoading(false);
//   }, 1000);
// };

// fetchData();

"use client";

import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { StoringContext } from "@/components/GlobalContext";
import Loading from "@/app/loading";
import { RefreshContext } from "../LayoutClient";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CoinGraph = ({ params }) => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const { currency } = useContext(StoringContext);
  const [refresh] = useContext(RefreshContext);

  const convertTimestamps = (data) => {
    return data?.map(([timestamp, open, high, low, close]) => {
      const date = new Date(timestamp);
      const formattedDate = date
        .toISOString()
        .replace("T", " ")
        .substring(5, 11);
      return {
        x: formattedDate,
        y: [open, high, low, close],
      };
    });
  };

  const getHighLowValues = (data) => {
    let highestHigh = Number.MIN_VALUE;
    let lowestLow = Number.MAX_VALUE;

    data?.forEach(([timestamp, open, high, low, close]) => {
      if (high > highestHigh) highestHigh = high;
      if (low < lowestLow) lowestLow = low;
    });

    return { highestHigh, lowestLow };
  };

  useEffect(() => {
    const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}/ohlc?vs_currency=${currency}&days=${days}`;
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
        setGraphData(response);
      } catch (error) {
        console.log("Error0: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currency, days, refresh]);

  const formattedData = convertTimestamps(graphData);
  const { highestHigh, lowestLow } = getHighLowValues(graphData);

  // Ensure min is not greater than max
  const minY = Math.min(lowestLow, highestHigh);
  const maxY = Math.max(lowestLow, highestHigh);

  const handleDays = (d) => {
    setDays(d);
  };

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="shadow-xl rounded-lg w-full overflow-y-hidden">
          <div className="flex items-center justify-end gap-2 p-2 bg-gray-200">
            <button
              onClick={() => handleDays(1)}
              className={`p-1 px-2 rounded ${
                days === 1 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              24h
            </button>
            <button
              onClick={() => handleDays(7)}
              className={`p-1 px-2 rounded ${
                days === 7 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => handleDays(30)}
              className={`p-1 px-2 rounded ${
                days === 30 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              1m
            </button>
            <button
              onClick={() => handleDays(90)}
              className={`p-1 px-2 rounded ${
                days === 90 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              3m
            </button>
            <button
              onClick={() => handleDays(180)}
              className={`p-1 px-2 rounded ${
                days === 180 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              6m
            </button>
            <button
              onClick={() => handleDays(365)}
              className={`p-1 px-2 rounded ${
                days === 365 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              1y
            </button>
          </div>
          <Chart
            className="overflow-x-auto overflow-y-hidden"
            type="candlestick"
            width={600}
            height={500}
            series={[
              {
                name: params.coinId,
                data: formattedData,
              },
            ]}
            options={{
              title: {
                text: "",
                align: "center",
                style: {
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#263238",
                },
              },
              colors: ["#00BFFF"],
              chart: {
                stacked: true,
              },
              xaxis: {
                type: "category",
                title: {
                  text: "Date",
                },
              },
              yaxis: {
                title: {
                  text: "Price",
                },
                min: minY,
                max: maxY,
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default CoinGraph;
