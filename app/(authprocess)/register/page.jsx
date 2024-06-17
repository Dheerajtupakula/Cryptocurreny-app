"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Register = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [userDataRegister, setUserDataRegister] = useState({
    email: "",
    password: "",
    reenteredPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataRegister((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userDataRegister.password !== userDataRegister.reenteredPassword) {
      alert("Error: Passwords do not match");
      return;
    }

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDataRegister),
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/login");
    } else {
      console.log(`Error: ${data.error}`);
    }
  };

  return (
    <div className="flex min-h-full max-sm:-mt-6 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create an Account
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
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 outline-none focus:outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                value={userDataRegister.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={`${isShowPassword ? "text" : "password"}`}
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                value={userDataRegister.password}
                onChange={handleChange}
              />
              <span
                className="absolute top-2 right-4"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {" "}
                {isShowPassword ? (
                  <IoEye className="text-lg text-slate-500" />
                ) : (
                  <IoEyeOff className="text-lg text-slate-500" />
                )}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="reenteredPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Re-enter Password
            </label>
            <div className="mt-2 relative">
              <input
                id="reenteredPassword"
                name="reenteredPassword"
                type={`${isShow ? "text" : "password"}`}
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                value={userDataRegister.reenteredPassword}
                onChange={handleChange}
              />
              <span
                className="absolute top-2 right-4"
                onClick={() => setIsShow(!isShow)}
              >
                {" "}
                {isShow ? (
                  <IoEye className="text-lg text-slate-500" />
                ) : (
                  <IoEyeOff className="text-lg text-slate-500" />
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-center items-center">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-slate-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
