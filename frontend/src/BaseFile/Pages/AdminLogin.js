// import React, { useState, useEffect } from "react";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import ErrorAlert from "../comman/ErrorAlert";
// import { loginAdmin, clearErrors } from "../../redux/authSlice";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../comman/Spinner";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Link } from "react-router-dom";
// import Header from "../../CoreFile/Header";
// import Footer from "../../CoreFile/Footer";

// export default function AdminLogin() {
//   const [showPass, setShowPass] = useState(false);
//   const { loading, error, admin } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Incorrect email").required("Email is required"),
//     password: Yup.string().required("Password is required"),
//   });

//   const formik = useFormik({
//     initialValues,
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       dispatch(loginAdmin(values));
//     },
//   });

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         dispatch(clearErrors());
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//     if (admin) {
//       navigate(`/admin/dashboard`);
//     }
//   }, [error, dispatch, admin, navigate]);

//   return (
//     <>
//       <div className="min-h-screen md:grid grid-cols-2 ">
//   {/* Left Side - Branding */}
//   <div className="min-h-screen hidden md:flex  md:pt-0 pt-12 bg-cover bg-center items-center justify-center px-4"
//   style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/robot-with-headphones-stands-front-bar-graph_843415-810.jpg?uid=R180299756&ga=GA1.1.815902557.1738949051&semt=ais_hybrid&w=740')" }}>
//     <div className="text-center space-y-6 bg-black/50 p-5 rounded-md">
//       <h1 className="text-5xl font-extrabold tracking-tight ">GFX</h1>
//       <p className="text-xl opacity-80">Welcome back, secure your zone!</p>
//     </div>
//   </div>

//   {/* Right Side - Login Form */}
//   <div className="w-full  bg-white flex items-center justify-center px-6 py-16">
//     <div className="w-full max-w-md">
//       <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Admin Login</h2>
//       <form className="space-y-6" onSubmit={formik.handleSubmit}>
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email address
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             required
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className="mt-1 w-full px-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
//           />
//           {formik.touched.email && formik.errors.email && (
//             <p className="text-red-500 text-sm mt-1">{formik.errors.email}*</p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <div className="relative mt-1">
//             <input
//               id="password"
//               name="password"
//               type={showPass ? "text" : "password"}
//               required
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
//             />
//             <span
//               onClick={() => setShowPass(!showPass)}
//               className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//             >
//               {showPass ? (
//                 <FaRegEyeSlash className="text-gray-500" />
//               ) : (
//                 <FaRegEye className="text-gray-500" />
//               )}
//             </span>
//           </div>
//           {formik.touched.password && formik.errors.password && (
//             <p className="text-red-500 text-sm mt-1">{formik.errors.password}*</p>
//           )}
//         </div>

//         {error && <ErrorAlert error={error} />}

//         <button
//           type="submit"
//           className={`w-full py-2 rounded-lg text-white font-semibold ${
//             loading ? "bg-green-400" : "bg-gradient-to-r from-[#263283] to-[#ed2924] "
//           } transition duration-200`}
//         >
//           {loading ? <Spinner /> : "Login"}
//         </button>
//       </form>

//       <p className="mt-6 text-center text-sm text-gray-600">
//         Not an admin?{" "}
//         <Link
//           to="/"
//           className="text-red-600 font-medium hover:underline"
//         >
//           Go to User Login
//         </Link>
//       </p>
//     </div>
//   </div>
// </div>

//       {/* <Footer /> */}
//     </>
//   );
// }






import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../comman/ErrorAlert";
import { loginAdmin, clearErrors } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../comman/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
 
export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false);
  const { loading, error, admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const initialValues = {
    email: "",
    password: "",
  };
 
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Incorrect email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
 
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(loginAdmin(values));
    },
  });
 
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 2000);
 
      return () => clearTimeout(timer);
    }
    if (admin) {
      navigate(`/admin/dashboard`);
    }
  }, [error, dispatch, admin, navigate]);
 
  return (
    <>
 
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-700 to-indigo-400 py-12 px-6">
  {/* Card Container */}
  <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-8 space-y-8 ">
   
    {/* Branding Section */}
    <div className="text-center space-y-6">
      <img src="/r2rblue.png" alt="Logo" className="w-28 h-28 mx-auto mb-4" />
      <h1 className="text-5xl font-extrabold text-gray-800">R2R Globle Admin</h1>
      <p className="text-lg text-gray-500">Securely access your admin dashboard</p>
    </div>
 
    {/* Login Form */}
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
     
      {/* Email Field */}
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="peer w-full px-6 py-4 rounded-lg bg-gray-50 border-2 border-gray-300  placeholder-transparent text-black placeholder:text-black focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all"
          placeholder="Email"
        />
 
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-400 text-sm mt-1">{formik.errors.email}*</p>
        )}
      </div>
 
      {/* Password Field */}
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPass ? "text" : "password"}
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="peer w-full px-6 py-4 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-800 placeholder-transparent placeholder:text-black focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all"
          placeholder="Password"
        />
   
        <span onClick={() => setShowPass(!showPass)} className="absolute right-6 top-4 cursor-pointer text-gray-500">
          {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
        </span>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-400 text-sm mt-1">{formik.errors.password}*</p>
        )}
      </div>
 
      {/* Error Message */}
      {error && <ErrorAlert error={error} />}
 
      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-4 font-semibold text-lg text-white rounded-lg focus:outline-none transition duration-300 ${
          loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-gradient-to-br from-yellow-600 to-purple-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500"
        }`}
      >
        {loading ? <Spinner /> : "Login"}
      </button>
    </form>
 
    {/* Optional Divider */}
  </div>
</div>
 
    </>
  );
}
 
 