"use client";

import { FaAngleRight } from "react-icons/fa";

import Link from "next/link";
import { IoRefreshOutline } from "react-icons/io5";

const CoinDetails = ({ params }) => {
  const RefreshHandle = () => {};
  return (
    <>
      <div className="flex p-2 gap-3 justify-start items-center font-semibold">
        <Link className="hover:text-green-800 " href="/">
          Cryptocurrencies
        </Link>{" "}
        <FaAngleRight /> <span>{params.coinId}</span>
      </div>
      <div className="fixed bottom-1 right-2">
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
    </>
  );
};

export default CoinDetails;
