import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTicket, resetState } from "../../redux/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import Loader from '../../BaseFile/comman/Loader';

const AddQuery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { loading, error, message } = useSelector((state) => state.tickets);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const initialValues = {
    subject: "",
    description: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string()
      .required("Subject is required")
      .min(10, "Subject must be at least 10 characters")
      .max(100, "Subject cannot exceed 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(20, "Description must be at least 20 characters"),
  });

  const onSubmit = (values) => {
    values.user_id = auth?.id;
    dispatch(createTicket(values));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Create New Support Ticket</h2>
          <p className="text-blue-100 mt-1">We'll get back to you as soon as possible</p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <SuccessModal
            open={open}
            setOpen={setOpen}
            message={message}
            reset={resetState}
          />
          <ErrorModal
            open={openError}
            setOpen={setOpenError}
            error={error}
            reset={resetState}
          />
          <Loader isLoading={loading} />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-6">
                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      name="subject"
                      type="text"
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                        isValid ? "focus:ring-blue-500" : "focus:ring-red-500"
                      } focus:border-transparent transition`}
                      placeholder="What's your query about?"
                    />
                    <ErrorMessage
                      name="subject"
                      component="div"
                      className="absolute -bottom-5 left-0 text-red-500 text-xs"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      as="textarea"
                      name="description"
                      rows="6"
                      className={`w-full px-4 py-3 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 ${
                        isValid ? "focus:ring-blue-500" : "focus:ring-red-500"
                      } focus:border-transparent transition`}
                      placeholder="Please describe your issue in detail..."
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="absolute -bottom-5 left-0 text-red-500 text-xs"
                    />
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`px-6 py-3 rounded-lg font-medium text-white transition ${
                      isSubmitting || !isValid
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddQuery;