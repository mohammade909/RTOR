

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "../comman/Spinner";
import {
  signupUser,
  clearErrors,
  clearMessage,
  sendVerificationEmail,
  verifyEmailCode,
} from "../../redux/authSlice";
import ErrorAlert from "../comman/ErrorAlert";
import SuccessAlert from "../comman/SuccessAlert";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import PhoneInput from "react-phone-input-2";
import { motion } from "framer-motion";
import "react-phone-input-2/lib/style.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function Registration() {
  const [referralCode, setReferralCode] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1); // Step 1: Email verification, Step 2: Full registration
  const [verificationCode, setVerificationCode] = useState("");
  const [emailToVerify, setEmailToVerify] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message, auth } = useSelector((state) => state.auth);

  useEffect(() => {
    const referral = query.get("referral");
    if (referral) {
      setReferralCode(referral);
    }
    if (auth) {
      navigate(`/`);
    }
  }, [query, auth, navigate]);

  const [showPass, setShowPass] = useState(false);

  // Email verification form
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      // In a real implementation, this would call an API to send a verification code
      try {
        // Simulate API call to send verification code
        // In a real implementation, replace this with actual API call:
        // await dispatch(sendVerificationEmail(values.email));
        await dispatch(sendVerificationEmail({ email: values.email }));
        // For demonstration, we'll just pretend the email was sent
        setEmailToVerify(values.email);
        setIsEmailSent(true);
        // Show success message
      } catch (err) {
        dispatch({
          type: "auth/setError",
          payload: "Failed to send verification code",
        });
      }
    },
  });

  // Verification code form
  const verifyCodeFormik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema: Yup.object().shape({
      verificationCode: Yup.string()
        .required("Verification code is required")
        .min(4, "Code must be at least 4 characters"),
    }),
    onSubmit: async (values) => {
      try {
        // In a real implementation, verify the code with an API call

        await dispatch(
          verifyEmailCode({
            email: emailToVerify,
            otp: values.verificationCode,
          })
        );

        // For demonstration, we'll just pretend any code is valid
        // In real implementation, check API response
        setRegistrationStep(2);
        mainFormik.setFieldValue("email", emailToVerify);
        dispatch({
          type: "auth/setMessage",
          payload: "Email verified successfully",
        });
      } catch (err) {
        setVerificationError("Invalid verification code");
      }
    },
  });

  // Main registration form
  const mainFormik = useFormik({
    initialValues: {
      fullname: "",
      phone: "",
      email: emailToVerify,
      password: "",
      confirmPassword: "",
      referralBy: referralCode || "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Incorrect email")
        .required("Email is required"),
      fullname: Yup.string().required("fullname is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      phone: Yup.number().required("Phone is required"),
    }),
    onSubmit: async (values) => {
      if (referralCode) {
        values.referralBy = referralCode;
      }
      dispatch(signupUser(values));
    },
  });

  // Resend verification code
  const handleResendCode = () => {
    setIsEmailSent(false);
    // In a real implementation, call the API again to resend the code
    setTimeout(() => {
      setIsEmailSent(true);
      dispatch({
        type: "auth/setMessage",
        payload: "Verification code resent to your email",
      });
    }, 1000);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 10000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, message]);

  return (
    <>
      <Header />
      <div className="w-full bg-gradient-to-br from-orange-400 to-blue-900 flex items-center justify-center pb-12 pt-24">
        {error && <ErrorAlert error={error} />}
        {message && <SuccessAlert message={"Opration Successfull!"} />}
        <div className="grid md:grid-cols-2 w-full max-w-7xl bg-gray-900/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          {/* Left Section: Image with content */}
          <motion.div
            className="flex flex-col justify-between pb-8 text-white bg-black/20"
            transition={{ duration: 1.5 }}
          >
            <div>
              <div className="px-5 flex justify-center text-center">
                <img src="/r2rblue.png" alt="" className="h-auto w-32" />
              </div>
              <h2 className="text-4xl font-extrabold mb-2 px-5 text-center"></h2>
            </div>

            <div className="flex items-center py-4 justify-center">
              <img
                src="https://img.freepik.com/premium-photo/lobby-with-couch-chairs-chandelier_1109006-78057.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740"
                alt="Trade Visual"
                className="w-full h-auto max-h-[350px] object-cover"
              />
            </div>
            <p className="text-white/80 text-sm px-5 text-center">
              Join our platform to access automated tools, professional signals,
              and expert guidance. Your journey starts here.
            </p>
          </motion.div>

          {/* Right Section: Registration Form */}
          <div className="w-full flex items-center justify-center">
            <div className="w-full p-8 rounded-2xl text-white">
              <h3 className="text-3xl font-semibold mb-6 text-center">
                {registrationStep === 1
                  ? "Verify Your Email"
                  : "Complete Registration"}
              </h3>

              {/* Step 1: Email Verification */}
              {registrationStep === 1 && (
                <>
                  {!isEmailSent ? (
                    // Email Input Form
                    <form
                      onSubmit={emailFormik.handleSubmit}
                      className="max-w-md mx-auto"
                    >
                      <div className="mb-6">
                        <label htmlFor="email" className="block text-sm mb-2">
                          Enter your email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={emailFormik.values.email}
                          onChange={emailFormik.handleChange}
                          onBlur={emailFormik.handleBlur}
                          className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white/70 text-white px-4 py-4 rounded-xl outline-none transition"
                        />
                        {emailFormik.touched.email &&
                          emailFormik.errors.email && (
                            <p className="text-xs text-red-400 mt-1">
                              {emailFormik.errors.email}
                            </p>
                          )}
                      </div>

                      <div className="mt-8 flex justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-br from-blue-500 to-orange-500 hover:from-blue-700 hover:to-orange-700 px-8 py-3 rounded-full text-base font-semibold shadow-lg transition-all duration-300 w-full max-w-xs"
                        >
                          {loading ? <Spinner /> : "Send Verification Code"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Verification Code Input
                    <form
                      onSubmit={verifyCodeFormik.handleSubmit}
                      className="max-w-md mx-auto"
                    >
                      <div className="mb-6">
                        <div className="mb-2 text-center">
                          <p className="text-white/80 mb-2">
                            We've sent a verification code to
                          </p>
                          <p className="font-medium text-lg">{emailToVerify}</p>
                        </div>

                        <div className="mt-6">
                          <label
                            htmlFor="verificationCode"
                            className="block text-sm mb-2"
                          >
                            Enter verification code
                          </label>
                          <input
                            id="verificationCode"
                            name="verificationCode"
                            type="text"
                            required
                            placeholder="Enter 6-digit code"
                            value={verifyCodeFormik.values.verificationCode}
                            onChange={verifyCodeFormik.handleChange}
                            onBlur={verifyCodeFormik.handleBlur}
                            className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white/70 text-white px-4 py-4 rounded-xl outline-none transition text-center text-xl tracking-wider"
                          />
                          {verifyCodeFormik.touched.verificationCode &&
                            verifyCodeFormik.errors.verificationCode && (
                              <p className="text-xs text-red-400 mt-1">
                                {verifyCodeFormik.errors.verificationCode}
                              </p>
                            )}
                          {verificationError && (
                            <p className="text-xs text-red-400 mt-1">
                              {verificationError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-br from-blue-500 to-orange-500 hover:from-blue-700 hover:to-orange-700 px-8 py-3 rounded-full text-base font-semibold shadow-lg transition-all duration-300 w-full max-w-xs"
                        >
                          {loading ? <Spinner /> : "Verify Email"}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-blue-300 hover:text-blue-200 text-sm underline"
                        >
                          Didn't receive the code? Resend
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEmailSent(false);
                            emailFormik.resetForm();
                          }}
                          className="text-white/70 hover:text-white text-sm"
                        >
                          Use a different email address
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Step 2: Complete Registration */}
              {registrationStep === 2 && (
                <form onSubmit={mainFormik.handleSubmit}>
                  <div className="gap-4 sm:grid grid-cols-2">
                    {/* Email (readonly) */}
                    <div>
                      <label htmlFor="email" className="block text-sm mb-1">
                        Email (Verified)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={emailToVerify}
                        readOnly
                        className="w-full bg-white/10 border border-white/30 text-white/70 px-4 py-3 rounded-xl outline-none transition"
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullname" className="block text-sm mb-1">
                        Full Name
                      </label>
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        required
                        value={mainFormik.values.fullname}
                        onChange={mainFormik.handleChange}
                        onBlur={mainFormik.handleBlur}
                        className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white text-white px-4 py-3 rounded-xl outline-none transition"
                      />
                      {mainFormik.touched.fullname &&
                        mainFormik.errors.fullname && (
                          <p className="text-xs text-red-400 mt-1">
                            {mainFormik.errors.fullname}
                          </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm mb-1">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        required
                        value={mainFormik.values.password}
                        onChange={mainFormik.handleChange}
                        onBlur={mainFormik.handleBlur}
                        className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white text-white px-4 py-3 rounded-xl outline-none transition"
                      />
                      <span
                        onClick={() => setShowPass(!showPass)}
                        className="absolute top-10 right-4 text-white cursor-pointer"
                      >
                        {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                      {mainFormik.touched.password &&
                        mainFormik.errors.password && (
                          <p className="text-xs text-red-400 mt-1">
                            {mainFormik.errors.password}
                          </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPass ? "text" : "password"}
                        required
                        value={mainFormik.values.confirmPassword}
                        onChange={mainFormik.handleChange}
                        onBlur={mainFormik.handleBlur}
                        className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white text-white px-4 py-3 rounded-xl outline-none transition"
                      />
                      {mainFormik.touched.confirmPassword &&
                        mainFormik.errors.confirmPassword && (
                          <p className="text-xs text-red-400 mt-1">
                            {mainFormik.errors.confirmPassword}
                          </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="text-sm block mb-1">
                        Phone
                      </label>
                      <PhoneInput
                        country={"us"}
                        inputProps={{
                          id: "phone",
                          name: "phone",
                          required: true,
                        }}
                        value={mainFormik.values.phone}
                        onChange={(phone) =>
                          mainFormik.setFieldValue("phone", phone)
                        }
                        onBlur={mainFormik.handleBlur}
                        containerClass="!w-full !rounded-xl hover:!rounded-xl !text-white"
                        inputClass="!w-full !py-4 !bg-white/20 !text-lg !text-white !pl-12 !border !border-white/30 focus:!border-purple-500 !placeholder-white !rounded-xl !transition"
                        buttonClass="!bg-white/20 !rounded-xl !border-white/30"
                        dropdownClass="!text-black"
                      />
                      {mainFormik.touched.phone && mainFormik.errors.phone && (
                        <p className="text-xs text-red-400 mt-1">
                          {mainFormik.errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Referral Code */}
                    <div>
                      <label
                        htmlFor="referralBy"
                        className="block text-sm mb-1"
                      >
                        Referral Code
                      </label>
                      <input
                        id="referralBy"
                        name="referralBy"
                        type="text"
                        value={referralCode || mainFormik.values.referralBy}
                        onChange={mainFormik.handleChange}
                        onBlur={mainFormik.handleBlur}
                        disabled={!!referralCode}
                        className="w-full bg-white/20 border border-white/30 focus:border-purple-500 placeholder-white text-white px-4 py-3 rounded-xl outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-center pt-6 text-base">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mr-2 h-4 w-4"
                      required
                    />
                    <label htmlFor="terms" className="text-white/80">
                      I agree to the{" "}
                      <span className="underline text-orange-300">
                        <Link  target='_blank' to={"/terms-conditions"}>Terms</Link>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="py-5 flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-br from-blue-500 to-orange-500 hover:from-blue-700 hover:to-orange-700 px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-300"
                    >
                      {loading ? <Spinner /> : "Complete Registration"}
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center flex gap-2 items-center justify-center mt-4">
                <p className="text-white/70 text-base">
                  Already have an account?
                </p>
                <Link
                  to="/user/login"
                  className="inline-block text-base px-2 py-1 bg-white/20 rounded-full hover:bg-white/30 transition duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
