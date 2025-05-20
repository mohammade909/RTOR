import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateOffer, resetState } from "../redux/offer";
import { useDispatch, useSelector } from "react-redux";

const UpdateOfferModal = ({ isOpen, onClose, offerData, allPlans = [] }) => {
  const dispatch = useDispatch();
  const [isForAllUsers, setIsForAllUsers] = useState(!offerData?.users);
  const [selectedUsers, setSelectedUsers] = useState(offerData?.user_ids || []);
  const [showUserTable, setShowUserTable] = useState(false);

  // Sample validation schema - adjust according to your needs
  const validationSchema = Yup.object({});

  useEffect(() => {
    if (offerData) {
      setIsForAllUsers(!offerData.users);
      setSelectedUsers(offerData.user_ids || []);
    }
  }, [offerData]);

  const handlePlanChange = (e, setFieldValue) => {
    const planId = e.target.value;
    setFieldValue("planId", planId);

    // Find selected plan to update user_plan_val
    const selectedPlan = allPlans.find((plan) => plan.id.toString() === planId);
    if (selectedPlan) {
      setFieldValue("user_plan_val", selectedPlan.monthly_price);
    }
  };

  if (!isOpen) return null;

  const initialValues = {
    title: offerData?.title || "",
    description: offerData?.description || "",
    status: offerData?.status || "active",
    user_plan_val: offerData?.user_plan_val || "",
  };

  const handleSubmit = (values) => {
    dispatch(updateOffer({ id: offerData?.offer_id, updatedData: values }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-[#111c54c7] rounded overflow-hidden transform translate-x-[-50%] translate-y-[-50%] absolute top-36 left-[40%]"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold tracking-wide">Update Offer</h2>
          <p className="text-sm text-blue-100 mt-2">
            Modify the details for your offer
          </p>
        </div>

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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

              {/* <div className="grid md:grid-cols-2 gap-6">
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
                    className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  />
                  <ErrorMessage
                    name="reward"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>
              </div> */}

              {/* <div className="grid md:grid-cols-2 gap-6">
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
              </div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Status
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </Field>
              </motion.div>

              {/* <motion.div
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
                  {allPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ${plan.monthly_price}
                    </option>
                  ))}
                </Field>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  User Plan Value
                </label>
                <Field
                  name="user_plan_val"
                  className="w-full px-4 text-white py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                />
              </motion.div>

              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center"
              >
                <Field
                  type="checkbox"
                  name="users"
                  id="users"
                  checked={values.users}
                  onChange={(e) => {
                    setFieldValue("users", e.target.checked);
                    setIsForAllUsers(!e.target.checked);
                    if (!e.target.checked) {
                      setFieldValue("user_ids", []);
                      setSelectedUsers([]);
                    } else {
                      setShowUserTable(true);
                    }
                  }}
                  className="mr-3 h-4 w-4 text-white bg-[#7050d1b3] text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="users"
                  className="text-sm font-medium text-gray-200"
                >
                  Enable User Selection
                </label>
              </motion.div> */}

              {/* {values.users && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    User IDs (comma separated)
                  </label>
                  <Field
                    name="user_ids"
                    className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    render={({ field, form }) => (
                      <input
                        type="text"
                        {...field}
                        value={form.values.user_ids.join(",")}
                        onChange={(e) => {
                          const ids = e.target.value
                            .split(",")
                            .map((id) => {
                              const parsed = parseInt(id.trim());
                              return isNaN(parsed) ? "" : parsed;
                            })
                            .filter((id) => id !== "");

                          form.setFieldValue("user_ids", ids);
                          setSelectedUsers(ids);
                        }}
                        className="w-full text-white px-4 py-3 bg-[#7050d1b3] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                      />
                    )}
                  />
                </motion.div>
              )} */}

              <div className="flex justify-end pt-4 space-x-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  type="button"
                  onClick={onClose}
                  className="px-5 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  type="submit"
                  className="px-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Offer
                </motion.button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default UpdateOfferModal;
