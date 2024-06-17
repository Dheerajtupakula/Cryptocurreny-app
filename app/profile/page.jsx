"use client";

import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import Table from "@/components/Table";
import { CoinDataContext } from "@/components/GlobalContext";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [myCoins, setMyCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { coinData } = useContext(CoinDataContext);
  const [myCoinData, setMyCoinData] = useState([]);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  const toDisplay = 10;
  useEffect(() => {
    if (!session) {
      redirect("/login");
    }
  });

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
  }, []);

  useEffect(() => {
    const favoriteCoinsList = coinData.filter((coin) =>
      myCoins.includes(coin.id)
    );

    setMyCoinData(favoriteCoinsList);
  }, [myCoins, coinData]);

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
                  coinData={myCoinData}
                  page={page}
                  toDisplay={toDisplay}
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
