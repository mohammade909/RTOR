import { useState, useEffect } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import ErrorAlert from "../BaseFile/comman/ErrorAlert"
import SuccessAlret from "../BaseFile/comman/SuccessAlert"
import { loginUser, clearErrors } from "../redux/authSlice"
import { useSelector, useDispatch } from "react-redux"
import Spinner from "../BaseFile/comman/Spinner"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import { sendForgotLink, clearMessage, clearErrors as clrerr } from "../redux/forgotSlice"

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const { loading, error, auth } = useSelector((state) => state.auth)
  const { loading: load, message, error: Err } = useSelector((state) => state.forgot)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email or username is required"),
    password: Yup.string().required("Password is required"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(loginUser(values))
    },
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors())
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (Err) {
      const timer = setTimeout(() => {
        dispatch(clrerr())
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage())
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (auth) {
      navigate(`/${auth?.role}/dashboard`)
    }
  }, [error, dispatch, auth, message, Err])

  const handleForgotPass = () => {
    if (formik.values.email === "") {
      alert("Please enter your email")
      return
    }
    const forgotData = { email: formik.values.email, role: "user" }
    dispatch(sendForgotLink(forgotData))
  }
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
  <div className="w-full max-w-6xl flex flex-col lg:flex-row overflow-hidden rounded-3xl shadow-2xl">
    {/* Left side - Form section */}
    <div className="w-full lg:w-1/2 bg-white p-8 md:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-12">
          <div className="w-24 h-auto flex items-center justify-center mr-3">
            <Link to={'/'}><img src="/logo.png" alt="Logo" className="" /></Link>
          </div>
          <h1 className="text-xl font-bold text-gray-800">BOTEDGE<span className="text-[#0bcbff] ">TRADE</span></h1>
        </div>
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-gray-500">Please enter your credentials to access your account</p>
        </div>
        
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Enter your email or username"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0bcbff]  transition-all duration-200 bg-gray-50"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPass}
                className="text-sm font-medium text-[#0bcbff]  hover:text-[#0bcbff] "
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0bcbff]  transition-all duration-200 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showPass ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          {error && <ErrorAlert error={error} />}
          {Err && <ErrorAlert error={Err} />}
          {message && <SuccessAlret message={message} />}

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#0bcbff]  focus:ring-[#0bcbff]  border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Keep me signed in
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 flex justify-center items-center bg-[#0bcbff]  hover:bg-[#0bcbff]  text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading || load}
            >
              {loading || load ? <Spinner /> : (
                <>
                  Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-[#0bcbff]  hover:text-[#0bcbff] ">
            Create an account
          </Link>
        </p>
      </div>
    </div>
    
    {/* Right side - Image & Info section */}
    <div className="hidden lg:block w-1/2  relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0bcbff]  via-[#0bcbff]  to-emerald-800">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-2">Smart Trading Platform</h2>
            
            <p className="text-white/90 mb-6 text-lg">
              Access advanced trading tools, real-time analytics, and AI-powered insights to optimize your investment strategy.
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-center">Real-time Analytics</h3>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-center">AI Predictions</h3>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-center">Secure Trading</h3>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-center">Advanced Strategies</h3>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <blockquote className="text-white text-lg italic">
                "BotEdgeTrade has transformed my trading experience with its intelligent algorithms and user-friendly interface."
              </blockquote>
              <p className="text-white/80 mt-2 font-medium">— Alex Chen, Professional Trader</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
