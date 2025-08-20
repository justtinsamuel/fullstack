import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const loginHandler = () => {
    console.log("Login");

    const user = {
      username: "test",
      email: "test@mail.com"
    };

    // simpan ke localStorage dalam bentuk string
    localStorage.setItem("user", JSON.stringify(user));

    // redirect ke home
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h3 className="text-2xl font-bold mb-4">Login</h3>
      <button
        onClick={loginHandler}
        className="rounded-xl py-2 px-5 bg-blue-700 text-white hover:bg-blue-800"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
