"use client";

import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoRefreshOutline } from "react-icons/io5";

import SideBar from "@/components/SideBar";
import { CoinDataContext } from "@/components/GlobalContext";
import Loading from "./loading";
import Table from "@/components/Table";
import Navbar from "@/components/Navbar";

const Home = () => {
  const { coinData, setRefresh, loading } = useContext(CoinDataContext);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const route = useRouter();

  const toDisplay = 10;

  const indexOfLastItem = page * toDisplay;
  const indexOfFirstItem = indexOfLastItem - toDisplay;
  const currentItems = coinData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!session) {
      route.push("/login");
    }
  });

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

  return (
    <>
      {loading && <Loading />}
      {!loading && coinData && (
        <section className="w-full relative">
          <Navbar />
          <SideBar />
          <div className="w-full max-sm:mt-2 bg-slate-200 mb-12 overflow-x-auto">
            <Table
              coinData={currentItems}
              page={page}
              toDisplay={toDisplay}
              isDisable
            />
          </div>
          <div className="fixed bottom-0 w-full p-3 flex justify-between items-center text-white  bg-slate-900">
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
