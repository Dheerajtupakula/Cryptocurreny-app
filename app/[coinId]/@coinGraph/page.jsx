"use client";

import { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { CurrencyContext } from "@/components/GlobalContext";
import Loading from "@/app/loading";
import { RefreshContext } from "../LayoutClient";

const convertTimestamps = (data) => {
  return data?.map(([timestamp, open, high, low, close]) => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().replace("T", " ").substring(5, 11);
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

function Graph({ params }) {
  const [graphData, setGraphData] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [currency, setCurrency] = useContext(CurrencyContext);
  const [refresh, setRefresh] = useContext(RefreshContext);

  const { highestHigh, lowestLow } = getHighLowValues(graphData);
  const formattedData = convertTimestamps(graphData);

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
      setLoading(true);
      const data = await fetch(url, options);
      const response = await data.json();
      setGraphData(response);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [currency, days, refresh]);

  const handleDays = (d) => {
    setDays(d);
  };

  return (
    <>
      {loading && (
        <div>
          <Loading />
        </div>
      )}
      {!loading && (
        <div className="shadow-xl rounded-lg w-full  overflow-y-hidden">
          <div className="flex items-center justify-end gap-2 p-2 bg-gray-200">
            <button
              onClick={() => handleDays(1)}
              className={`p-1 px-2 rounded  ${
                days === 1 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              24h
            </button>
            <button
              onClick={() => handleDays(7)}
              className={`p-1 px-2 rounded  ${
                days === 7 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => handleDays(30)}
              className={`p-1 px-2 rounded  ${
                days === 30 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              1m
            </button>
            <button
              onClick={() => handleDays(90)}
              className={`p-1 px-2 rounded  ${
                days === 90 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              3m
            </button>
            <button
              onClick={() => handleDays(180)}
              className={`p-1 px-2 rounded  ${
                days === 180 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              90d
            </button>
            <button
              onClick={() => handleDays(365)}
              className={`p-1 px-2 rounded  ${
                days === 365 ? "bg-slate-400/75" : "bg-slate-300/50"
              }`}
            >
              1y
            </button>
          </div>
          <ReactApexChart
            className="overflow-x-auto overflow-y-hidden"
            type="candlestick"
            width={600}
            height={500}
            series={[
              {
                name: { params },
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
                type: "category",
                title: {
                  text: "Date",
                },
                min: lowestLow, // Set the minimum value for the y-axis
                max: highestHigh,
              },
            }}
          />
        </div>
      )}
    </>
  );
}

export default Graph;
