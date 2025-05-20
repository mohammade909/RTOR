import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateReward, clearSelectedReward } from "../redux/rewardSlice";

const RewardEditModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedReward, loading } = useSelector((state) => state.rewards);

  if (!isOpen || !selectedReward) return null;

  const handleSubmit = async (values) => {
    await dispatch(updateReward({ id: selectedReward.id, data: values }));
    onClose();
    dispatch(clearSelectedReward());
  };

  const handleClose = () => {
    dispatch(clearSelectedReward());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Reward Plan</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <Formik
          initialValues={{
            title: selectedReward.title,
            description: selectedReward.description || "",
            threshold: selectedReward.threshold,
            reward_amount: selectedReward.reward_amount,
            duration_days: selectedReward.duration_days,
            is_active: selectedReward.is_active === 1,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="threshold"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Threshold ($)
                  </label>
                  <Field
                    type="number"
                    name="threshold"
                    id="threshold"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <ErrorMessage
                    name="threshold"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reward_amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reward amount ($)
                  </label>
                  <Field
                    type="number"
                    name="reward_amount"
                    id="reward_amount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <ErrorMessage
                    name="reward_amount"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration_days"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (days)
                </label>
                <Field
                  type="number"
                  name="duration_days"
                  id="duration_days"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <ErrorMessage
                  name="duration_days"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={values.is_active}
                  onChange={() => setFieldValue("is_active", !values.is_active)}
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active
                </label>
                <ErrorMessage
                  name="is_active"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Reward"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RewardEditModal;
