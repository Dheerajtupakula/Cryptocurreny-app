import bcrypt from "bcrypt";
import UserData from "@/model/UserSchema";
import ConnectDB from "@/utils/Database";

export async function POST(request) {
  await ConnectDB();

  const { email, password } = await request.json();

  try {
    // Check if the user already exists
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create a new user with hashed password
    const newUser = await UserData.create({ email, password: hashedPassword });

    return new Response(
      JSON.stringify({ newUser, message: "logged in Successfully" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 201,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
}
