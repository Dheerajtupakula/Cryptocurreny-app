"use client";

import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import Table from "@/components/Table";
import { CoinDataContext, StoringContext } from "@/components/GlobalContext";
import Navbar from "@/components/Navbar";
import Loading from "../loading";

const Profile = () => {
  const [myCoins, setMyCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { coinData } = useContext(CoinDataContext);
  const [myCoinData, setMyCoinData] = useState([]);
  const [data, setData] = useState([]);
  const { setSortOption } = useContext(StoringContext);
  const [sortOrder, setSortOrder] = useState({
    key: "current_price",
    order: "asc",
  });

  const { data: session, status } = useSession();
  const [checkingSession, setCheckingSession] = useState(true);

  // Check session status and redirect if not authenticated
  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        redirect("/login");
      } else {
        setCheckingSession(false);
      }
    }
  }, [session, status]);

  // Fetch favorite coins for authenticated user
  useEffect(() => {
    if (session) {
      const fetchFavoriteCoins = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/favorite");

          if (response.ok) {
            const favoriteCoins = await response.json();
            const favoriteCoinsById = favoriteCoins.map((coin) => coin.coinId);
            setMyCoins(favoriteCoinsById);
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
  }, [session]);

  // Update myCoinData whenever coinData or myCoins change
  useEffect(() => {
    const favoriteCoinsList = coinData.filter((coin) =>
      myCoins.includes(coin.id)
    );
    setMyCoinData(favoriteCoinsList);
    setData(favoriteCoinsList); // Update data state as well
  }, [coinData, myCoins]);

  // Sort data based on sortOrder when user clicks on table header
  const sortData = (key) => {
    const order =
      sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc";
    const sortedData = [...myCoinData].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
    setSortOrder({ key, order });
  };

  if (checkingSession) {
    return <Loading />;
  }

  return (
    <div className="w-full ">
      <div>
        <Navbar />
        <div className="flex w-full justify-between max-sm:-mt-3 p-2 bg-slate-300 items-center">
          <p className="text-lg font-bold">My Profile</p>
          <button
            className="font-semibold  p-2 bg-slate-600 text-white hover:bg-slate-800 rounded-full px-4 text-sm"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>

        {myCoins.length > 0 ? (
          <div>
            {myCoinData.length > 0 ? (
              <div className="w-full bg-slate-200 mb-12 overflow-x-auto custom-scrollbar">
                <Table
                  coinData={data}
                  sortOrder={sortOrder}
                  sortData={sortData}
                  isDisable={false}
                />
              </div>
            ) : (
              <p className="h-[50vh] flex justify-center items-center text-lg font-semibold">
                Loading favorite coins...
              </p>
            )}
          </div>
        ) : (
          <p className="h-[50vh] flex justify-center items-center text-lg font-semibold">
            You have not added any favorite coins yet. Please add some to see
            them here.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
