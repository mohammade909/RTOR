import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../comman/ErrorAlert";
import SuccessAlret from "../comman/SuccessAlert";
import { loginUser, clearErrors } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../comman/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import {
  sendForgotLink,
  clearMessage,
  clearErrors as clrerr,
} from "../../redux/forgotSlice";
export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { loading, error, auth } = useSelector((state) => state.auth);
  const {
    loading: load,
    message,
    error: Err,
  } = useSelector((state) => state.forgot);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email or username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(loginUser(values));
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (Err) {
      const timer = setTimeout(() => {
        dispatch(clrerr());
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (auth) {
      navigate(`/${auth?.role}/dashboard`);
    }
  }, [error, dispatch, auth, message, Err]);

  const handleForgotPass = () => {
    if (formik.values.email == "") {
      alert("enter email");
    }
    const forgotData = { email: formik.values.email, role: "user" };
    console.log(forgotData);
    dispatch(sendForgotLink(forgotData));
  };
  return (
    <>
      <Header />

      <div className=" w-full pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-[#d78628] via-[#2e5799] to-gray-100">
        <div className="container mx-auto lg:px-0 px-4">
          <div className="grid md:grid-cols-2 max-w-6xl mx-auto">
            {/* Left Panel: Login Form */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-l-lg shadow-2xl p-8 text-white">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold">Welcome Back</h2>
                <p className="mt-2 text-white/80">
                  Sign in to continue to your account
                </p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email or Username<span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="text"
                      placeholder="Enter email..."
                      required
                      className="w-full rounded-lg px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-white/75 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-pink-400">
                      {formik.errors.email}*
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password<span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type={showPass ? "text" : "password"}
                      placeholder="Enter password..."
                      required
                      className="w-full rounded-lg px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-white/75 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                    />
                    <span
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-white cursor-pointer hover:text-pink-300 transition-colors"
                    >
                      {showPass ? (
                        <FaRegEyeSlash size={18} />
                      ) : (
                        <FaRegEye size={18} />
                      )}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-pink-400">
                      {formik.errors.password}*
                    </p>
                  )}
                </div>

                {/* Alerts */}
                {error && <ErrorAlert error={error} />}
                {Err && <ErrorAlert error={Err} />}
                {message && <SuccessAlret message={message} />}

                {/* Remember Me and Forgot Password */}
                <div className="flex justify-between items-center text-sm mb-6">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox text-pink-500 rounded focus:ring-pink-500"
                    />
                    <span className="ml-2 group-hover:text-pink-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <span
                    onClick={() => handleForgotPass()}
                    className="text-pink-300 hover:text-white cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-tr from-[#2e5799] to-[#d78628] hover:from-[#1e304d] hover:to-[#8a5c27] text-white text-base font-semibold py-3 px-4 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  {loading || load ? <Spinner /> : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span>Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-pink-300 hover:text-white font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>

            {/* Right Panel: Background Image with Content Overlay */}
            <div
              className="backdrop-blur-md border border-white/20 rounded-r-lg shadow-2xl overflow-hidden relative"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/free-photo/colonial-style-house-night-scene_1150-17925.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/40"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-center items-center text-center ">
                <div className="h-auto w-40   font-bold text-white ">
                  <img
                    src="/r2rwhite.png"
                    alt="Logo"
                    className="w-full h-auto"
                  />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  Secure Access Portal
                </h3>
                <p className="text-white/90 mb-8 max-w-xs">
                  Access your personalized dashboard and exclusive features with
                  our secure login system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
