import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { getAllNonUsers } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { createOffer, resetState } from "../redux/offer";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { getAllPlans } from "../redux/planSlice";
import { getAllUsers } from "../redux/userSlice";
import Loader from "../BaseFile/comman/Loader";

const OfferForm = () => {
  const dispatch = useDispatch();
  const inactiveUsers = useSelector((state) => state.allusers.allnonusers);
  const { allplans } = useSelector((state) => state.allplans);
  const { message, error } = useSelector((state) => state.offers);
  const [isForAllUsers, setIsForAllUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { allusers, loading } = useSelector((state) => state.allusers);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserTable, setShowUserTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllNonUsers());
    dispatch(getAllPlans());
    dispatch(getAllUsers());
  }, [dispatch]);

  const initialValues = {
    title: "",
    description: "",
    business_val: "",
    reward: "",
    start_date: "",
    end_date: "",
    status: "active",
    users: false,
    planId: null,
    user_ids: [],
    user_plan_val: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    business_val: Yup.number().required("Business value is required"),
    reward: Yup.number().required("Reward is required"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    dispatch(createOffer(values));
    resetForm();
    setSelectedUsers([]);
    setFilteredUsers([]);
    setShowUserTable(false);
    setCurrentPage(1);
  };

  // Handle user selection
  const handleUserSelection = (userId, setFieldValue, values) => {
    const currentSelectedUsers = [...values.user_ids];
    if (currentSelectedUsers.includes(userId)) {
      // Remove user if already selected
      setFieldValue(
        "user_ids",
        currentSelectedUsers.filter((id) => id !== userId)
      );
    } else {
      // Add user if not selected
      setFieldValue("user_ids", [...currentSelectedUsers, userId]);
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetState());
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handlePlanChange = (event, setFieldValue) => {
    const planId = event.target.value;
    setFieldValue("planId", planId);

    if (planId && allusers) {
      // Filter users by plan ID
      const usersWithSelectedPlan = allusers.filter(
        (user) => user.plan_id === Number(planId)
      );
      console.log(usersWithSelectedPlan);
      console.log(planId);
      setFilteredUsers(usersWithSelectedPlan);
      setShowUserTable(true);
      setCurrentPage(1);
    } else {
      setFilteredUsers([]);
      setShowUserTable(false);
    }
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // User details component for pagination
  const UserTable = ({ users, values, setFieldValue }) => {
    // Handle search
  

    const handleCheckAll = (setFieldValue) => {
      if (currentUsers.length === 0) return;
  
      // Check if all current visible users are already selected
      const allCurrentSelected = currentUsers.every((user) =>
        values.user_ids.includes(user.id)
      );
  
      if (allCurrentSelected) {
        // Uncheck all current visible users
        setFieldValue(
          "user_ids",
          values.user_ids.filter(
            (id) => !currentUsers.some((user) => user.id === id)
          )
        );
      } else {
        // Check all current visible users
        const newSelectedIds = [...values.user_ids];
        currentUsers.forEach((user) => {
          if (!newSelectedIds.includes(user.id)) {
            newSelectedIds.push(user.id);
          }
        });
        setFieldValue("user_ids", newSelectedIds);
      }
    };
    return (
      <div className="shadow overflow-hidden rounded-sm py-10">
   
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      currentUsers.length > 0 &&
                      currentUsers.every((user) =>
                        values.user_ids.includes(user.id)
                      )
                    }
                    onChange={() => handleCheckAll(setFieldValue)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  Select
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Username
              </th>
            </tr>
          </thead>
          <tbody className="">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-gray-100 even:bg-[#7e66c5b3] even:text:white bg-[#7e66c5b3]"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      value={user.id}
                      checked={values.user_ids.includes(user.id)}
                      onChange={() =>
                        handleUserSelection(user.id, setFieldValue, values)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{user.fullname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{user.email}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">
                      ({user.username})
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-200 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastUser >= filteredUsers.length}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                indexOfLastUser >= filteredUsers.length
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-200 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-200">
                Showing{" "}
                <span className="font-medium">
                  {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {indexOfLastUser > filteredUsers.length
                    ? filteredUsers.length
                    : indexOfLastUser}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span>{" "}
                users
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {Array.from({
                  length: Math.ceil(filteredUsers.length / usersPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111c54c7] flex items-center justify-center p-6">
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-[#111c54c7] rounded overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold tracking-wide">Create New Offer</h2>
          <p className="text-sm text-blue-100 mt-2">
            Fill out the details for your offer
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="p-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Title
                </label>
                <Field
                  name="title"
                  className="w-full px-4 text-white py-3 border border-gray-300 bg-[#7050d1b3] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="w-full text-white px-4 bg-[#7050d1b3] py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Value
                  </label>
                  <Field
                    name="business_val"
                    type="number"
                    className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  />
                  <ErrorMessage
                    name="business_val"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Reward
                  </label>
                  <Field
                    name="reward"
                    type="number"
                    className="w-full  text-white px-4 py-3  bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  />
                  <ErrorMessage
                    name="reward"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Start Date
                  </label>
                  <Field
                    name="start_date"
                    type="date"
                    className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  />
                  <ErrorMessage
                    name="start_date"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    End Date
                  </label>
                  <Field
                    name="end_date"
                    type="date"
                    className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  />
                  <ErrorMessage
                    name="end_date"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Select Plan
                </label>
                <Field
                  as="select"
                  name="planId"
                  onChange={(e) => handlePlanChange(e, setFieldValue)}
                  className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                >
                  <option value="">Select Plan</option>
                  {allplans?.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ${plan.monthly_price}
                    </option>
                  ))}
                </Field>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  User Plan Value
                </label>
                <Field
                  as="select"
                  name="user_plan_val"
                  className="w-full px-4 text-white py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                >
                  <option value="">Select Plan</option>
                  {allplans?.map((plan) => (
                    <option key={plan.id} value={plan.monthly_price}>
                      ${plan.monthly_price}
                    </option>
                  ))}
                </Field>
              </motion.div>

              {values.planId === null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center"
                >
                  <Field
                    type="checkbox"
                    name="users"
                    checked={isForAllUsers}
                    onChange={() => {
                      setIsForAllUsers(!isForAllUsers);
                      setFieldValue("users", !isForAllUsers);
                      setFieldValue("user_ids", []);
                      setSelectedUsers([]);
                    }}
                    className="mr-3 h-4 text-white w-4 bg-[#7050d1b3] text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-200">
                    Apply to All Users
                  </label>
                </motion.div>
              )}

              {showUserTable && !isForAllUsers && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 text-white "
                >
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Select Users
                  </label>
                  <UserTable
                    users={currentUsers}
                    values={values}
                    setFieldValue={setFieldValue}
                  />
                </motion.div>
              )}

              {!isForAllUsers && selectedUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-white border bg-[#7050d1b3] border-blue-200 p-4 rounded-lg"
                >
                  <p className="text-sm font-semibold text-blue-100 mb-2">
                    Selected Users: {selectedUsers.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredUsers
                      .filter((user) => selectedUsers.includes(user.id))
                      .map((user) => (
                        <span
                          key={user.id}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {user.fullname} ({user.username})
                        </span>
                      ))}
                  </div>
                </motion.div>
              )}
              <div className="flex justify-end">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  type="submit"
                  className=" px-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Offer
                </motion.button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default OfferForm;
