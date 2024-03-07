import React, { useState } from "react";
import Team from "../assets/team.jpg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, passWord);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePassWordChange = (e) => {
    setPassWord(e.target.value);
  };

  const dark = 50;

  return (
    <div className="flex items-center justify-between h-screen bg-cover bg-center opacity-100">
      <img
        className="absolute inset-0 -z-10 object-cover"
        src={Team}
        style={{
          backgroundImage: `url(${Team})`,
          filter: `brightness(${dark}%)`,
        }}
      />
      <div className="flex flex-col p-10 w-1/2"></div>
      <div className="flex flex-col justify-center items-center bg-white bg-opacity-90 p-10 w-1/2 h-full">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              onChange={handleEmailChange}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={handlePassWordChange}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
            <a
              href="#"
              className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Forgot Password?
            </a>
          </div>
          <div className="flex items-center justify-center"></div>
          <a
            href="#"
            className="text-xs text-center text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Account
          </a>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
