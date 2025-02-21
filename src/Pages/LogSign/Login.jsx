import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { userLogin, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    userLogin(email, password)
      .then((result) => {


        const user = result.user;
        setUser(user);
        navigate(location?.state?.from || "/taskHome");
      })
      .catch((err) => {
        setError({ ...error, login: err.code });
        if (err.code === "auth/wrong-password") {
          toast.error("Incorrect password. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Login failed. Please check your password.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <div className="flex items-center justify-center my-16 ">

      <ToastContainer />
      <div className="card bg-base-200 w-full max-w-sm shrink-0 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="password"
              className="input input-bordered pr-12"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-12 text-xl"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            <label className="label">
              <Link
                to="/forgetPassword"
                state={{ email }}
                className="label-text-alt link text-sm text-red-600"
              >
                Forgot password?
              </Link>
            </label>
          </div>
          <div className="form-control">
            <button className="btn text-xl bg-sky-500 text-white font-semibold">
              Login
            </button>
          </div>
          <p className="text-sm">
            Don't have an account? Why not
            <Link to="/signup" className="link text-sky-600 pl-2">
              Sign up
            </Link>
          </p>
        </form>
       
      </div>
    </div>
  );
};

export default Login;