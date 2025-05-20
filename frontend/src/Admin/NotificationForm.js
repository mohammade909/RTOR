import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotification,
  resetState,
  addBanner,
} from "../redux/notificationSlice";
import Spinner from "../BaseFile/comman/Spinner";
import { getAllUsers } from "../redux/userSlice";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
  users: Yup.boolean(),
  type: Yup.string()
    .oneOf(["notification", "site_popup"], "Invalid type")
    .required("Type is required"),
});

const NotificationForm = () => {
  const dispatch = useDispatch();
  const { allusers } = useSelector((state) => state.allusers);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [file, setFile] = useState(null);

  const { loading, error, message } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleUserSearch = (searchTerm) => {
    if (searchTerm) {
      const filteredUsers = allusers?.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id)); // Remove user if already selected
    } else {
      setSelectedUsers([...selectedUsers, user.id]); // Add user to selection
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.log("Select a file");
      return;
    }
    setFile(selectedFile);
    const formData = new FormData();
    formData.append("image", selectedFile);


    dispatch(addBanner(formData))
      .then((response) => {
        console.log("Banner added successfully", response);
      })
      .catch((error) => {
        console.error("Error adding banner:", error);
      });
  };
  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <div className="grid items-center  px-4 pb-4 mx-auto my-4 w-7xl  lg:mx-3 sm:mx-3 p-4 ">
        <div className="grid grid-cols-1 ">
          <div className="p-5 mt-4 text-gray-800 border border-gray-400 rounded-lg shadow-md bg-[#ffffffb3]">
            <h1 className="mb-4 text-2xl font-medium ">Create Notification</h1>
            <Formik
              initialValues={{
                title: "",
                message: "",
                users: true,
                type: "notification",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                // Prepare values including selected user IDs
                const notificationData = {
                  ...values,
                  recipients: selectedUsers,
                };
                console.log(notificationData);
                dispatch(createNotification(notificationData));
                // resetForm();
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block mb-1 text-base text-gray-800 font-semibold ">
                        Title
                      </label>
                      <Field
                        name="title"
                        as="input"
                        placeholder="Enter Title"
                        className="block w-full placeholder:text-gray-400 p-2 text-lg text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-base text-red-600"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-base text-gray-800 font-semibold ">
                        Upload Banner
                      </label>
                      <div className="">
                        <input
                          id="file"
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          className="  cursor-pointer w-full p-[5px] border border-gray-300 placeholder:text-gray-400 text-gray-800   rounded-md text-lg bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-base text-gray-800  font-semibold ">
                      Message
                    </label>
                    <Field
                      name="message"
                      as="textarea"
                      className="block w-full placeholder:text-gray-400  p-3 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="mt-1 text-lg text-red-600"
                    />
                  </div>

                  <div className="flex items-center mb-4">
                    <Field
                      type="checkbox"
                      name="users"
                      checked={values.users}
                      className="mr-2"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue("users", isChecked);
                        if (isChecked) {
                          setSelectedUsers([]); // Clear selected users when checked
                        }
                      }}
                    />
                    <label className="text-base  font-medium text-gray-800  ">All Users</label>
                  </div>

                  {!errors.users && !values.users && (
                    <div className="mb-4">
                      <label className="block mb-1 text-lg font-semibold text-gray-300">
                        Search User
                      </label>
                      <input
                        type="text"
                        placeholder="Search user"
                        onChange={(e) => handleUserSearch(e.target.value)}
                        className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {searchResults.length > 0 && (
                        <div className="p-2 mt-2 bg-gray-100 border border-gray-300 rounded-md">
                          {searchResults.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center mb-2"
                            >
                              <Field
                                type="checkbox"
                                name="userId"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelect(user)}
                                className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label className="text-gray-300">
                                {user.username}{" "}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show selected users */}
                  {selectedUsers.length > 0 && (
                    <div className="mb-4">
                      <label className="block mb-1 text-lg font-semibold text-gray-700">
                        Selected Users:
                      </label>
                      <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                        {selectedUsers.map((userId) => {
                          const user = allusers.find((u) => u.id === userId);
                          return user ? (
                            <span
                              key={userId}
                              className="px-2 py-1 mr-2 text-blue-800 bg-blue-100 rounded"
                            >
                              {user.username}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={` py-2 px-6 rounded-md text-white font-medium ${
                        loading
                          ? "bg-blue-300 opacity-70 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 transition duration-200"
                      }`}
                    >
                      {loading ? <Spinner /> : "Create"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationForm;
