"use client";

import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (session) {
      router.refresh();
      redirect("/");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      ...userData,
    });

    if (result.error) {
      console.error("Login failed:", result.error);
      alert("Login failed: Inavlid Email or Password ", result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-full max-sm:-mt-12 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                value={userData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-slate-600 hover:text-slate-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                value={userData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center items-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-slate-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              Sign in
            </button>

            <p className="relative w-full flex flex-col justify-center items-center">
              <span className=" bg-white px-3 rounded-full">or </span>
              <span className="w-full -z-10 h-1 absolute left-0 right-0 bg-slate-300 rounded-full "></span>
            </p>
            <div className="flex w-full justify-start rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-black ">
              <p>Don’t have an account yet? </p>
              {"   "}
              <Link href="/register" className="text-blue-500">
                {" "}
                Create One
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
