"use client";

import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoRefreshOutline } from "react-icons/io5";

import { CoinDataContext, StoringContext } from "@/components/GlobalContext";
import Loading from "./loading";
import Table from "@/components/Table";
import Navbar from "@/components/Navbar";

const Home = () => {
  const { coinData, setRefresh, loading } = useContext(CoinDataContext);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const { sortOption, setSortOption } = useContext(StoringContext);
  const [sortOrder, setSortOrder] = useState({
    key: "current_price",
    order: "asc",
  });
  const route = useRouter();

  const toDisplay = 10;

  useEffect(() => {
    if (!session) {
      route.push("/login");
    }
  }, [session, route]);

  useEffect(() => {
    setData(coinData);
  }, [coinData]);

  const sortData = (key) => {
    const order =
      sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
    setSortOrder({ key, order });
  };

  const indexOfLastItem = page * toDisplay;
  const indexOfFirstItem = indexOfLastItem - toDisplay;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevBtn = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextBtn = () => {
    if (page < Math.ceil(data.length / toDisplay)) {
      setPage((prev) => prev + 1);
    }
  };

  const RefreshHandle = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <>
      {loading && <Loading />}
      {!loading && data.length > 0 && (
        <section className="w-full relative">
          <Navbar />
          <div className="w-full max-sm:-mt-3 bg-slate-200 mb-12 overflow-x-auto">
            <Table
              coinData={currentItems}
              sortData={sortData}
              sortOrder={sortOrder}
              isDisable
            />
          </div>
          <div className="fixed bottom-0 w-full p-3 pb-5 max-sm:pb-3 flex justify-between items-center text-white bg-slate-900">
            <div>
              <button type="button" onClick={handlePrevBtn}>
                prev
              </button>
            </div>

            <div>
              page: {page} of {Math.ceil(data.length / toDisplay)}
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
