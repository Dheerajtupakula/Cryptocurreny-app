import UserData from "@/model/UserSchema";
import ConnectDB from "@/utils/Database";
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]/options";

export async function GET(req) {
  await ConnectDB();

  if (req.method === "GET") {
    try {
      const session = await getServerSession(options);
      if (session) {
        const email = session.user.email;

        const user = await UserData.findOne({ email });
        if (user) {
          return new Response(JSON.stringify(user.favoriteCoins), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        }

        return new Response(JSON.stringify({ message: "User not found" }), {
          headers: { "Content-Type": "application/json" },
          status: 404,
        });
      }
      return new Response(JSON.stringify({ message: "Login Now" }));
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Internal Server Error", error }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, {
      headers: { Allow: "POST, DELETE, GET" },
      status: 405,
    });
  }
}

// POST request
export async function POST(req) {
  await ConnectDB();

  if (req.method === "POST") {
    const { email, coinId, coinName } = await req.json();

    try {
      const user = await UserData.findOne({ email });

      if (user) {
        if (!user.favoriteCoins.some((coin) => coin.coinId === coinId)) {
          user.favoriteCoins.push({ coinId, coinName });
          await user.save();
          return new Response(JSON.stringify(user.favoriteCoins), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        }

        return new Response(
          JSON.stringify({ message: "Coin is already in favorites" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      return new Response(JSON.stringify({ message: "User not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } catch (error) {
      console.log(error, "500000 error");
      return new Response(
        JSON.stringify({ message: "Internal Server Error", error }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ message: `Method ${req.method} Not Allowed` }),
    {
      headers: { "Content-Type": "application/json" },
      status: 405,
    }
  );
}

export async function DELETE(req) {
  await ConnectDB();

  if (req.method === "DELETE") {
    const { email, coinId } = await req.json();

    try {
      const user = await UserData.findOne({ email });
      if (user) {
        user.favoriteCoins = user.favoriteCoins.filter(
          (coin) => coin.coinId !== coinId
        );
        await user.save();
        return new Response(JSON.stringify(user.favoriteCoins), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      return new Response(JSON.stringify({ message: "User not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Internal Server Error", error }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, {
      headers: { Allow: "POST, DELETE, GET" },
      status: 405,
    });
  }
}
