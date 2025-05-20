import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import SuccessAlret from "../BaseFile/comman/SuccessAlert";
import { loginUser, clearErrors } from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Header from "../CoreFile/Header";
import Footer from "../CoreFile/Footer";
import { LockClosedIcon } from '@heroicons/react/20/solid'; 
import { EnvelopeIcon } from '@heroicons/react/24/outline'; // or '24/solid' if you prefer filled style

import {
  sendForgotLink,
  clearMessage,
  clearErrors as clrerr,
} from "../redux/forgotSlice";

  export const Login = () => {
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
    console.log(Err);
  return (
    <>
    <Header/>
    <div className="h-[67px] bg-black"></div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-sm overflow-hidden shadow-2xl bg-black/70 border border-gray-700 backdrop-blur-md">
        <div className="hidden md:flex md:w-1/2 relative bg-black">
          <img
            src="https://img.freepik.com/free-photo/beautiful-cryptocurrwncy-concept_23-2149250229.jpg?uid=R176823449&ga=GA1.1.1433286368.1718702777&semt=ais_hybrid&w=740"
            alt="Trading Visual"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <LockClosedIcon className="h-10 w-10 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-gray-400">
              Sign in to access your trading dashboard
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6 text-left">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  placeholder="Enter email..."
                  required
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-xs text-red-400">{formik.errors.email}*</p>
        )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password..."
                  required
                  className="w-full pl-10 pr-10 py-2 bg-gray-900 text-white border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                 <span
            onClick={() => setShowPass(!showPass)}
            className="absolute top-2 right-3 text-white cursor-pointer"
          >
            {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-xs text-red-400">{formik.errors.password}*</p>
        )}
              </div>
             {/* Alerts */}
      {error && <ErrorAlert error={error} />}
      {Err && <ErrorAlert error={Err} />}
      {message && <SuccessAlret message={message} />}

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm mb-6">
        <label className="flex items-center">
          <input type="checkbox" className="form-checkbox text-red-400" />
          <span className="ml-2">Remember me</span>
        </label>
        <span
          onClick={() => handleForgotPass()}
          className="text-red-300 hover:underline cursor-pointer"
        >
          Forgot password?
        </span>
      </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all text-white py-2 rounded-md font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};
