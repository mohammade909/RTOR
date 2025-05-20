import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  deleteNotification,
} from "../redux/notificationSlice"; // Redux actions for notifications
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessAlert from "../BaseFile/comman/SuccessAlert"
import ErrorAlert from "../BaseFile/comman/ErrorAlert"
import { configureStore } from "@reduxjs/toolkit";
import * as Yup from "yup";
import {Confirmation} from "../BaseFile/comman/Confirmation"
const NotificationsTable = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, message } = useSelector(
    (state) => state.notifications
  );
  const [open, setOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  useEffect(() => {
    dispatch(getAllNotifications()); // Fetch notifications on component load
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteID(id);
    setOpen(true);
  };

  function isClose(){
    setOpen(false)
    setDeleteID(null)
  }

  // Validation schema for editing the notification
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    message: Yup.string().required("Message is required"),
    type: Yup.string().oneOf(['info', 'warning', 'error', 'success'], "Invalid type").required("Type is required"),
    status: Yup.string().oneOf(['unread', 'read'], "Invalid status").required("Status is required"),
  });

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4 ">
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <table className="min-w-full text-sm border text-gray-100 bg-black  border-collapse border-gray-900 table-auto">
        <thead>
          <tr className="uppercase ">
            <th className="px-4 py-2 text-center border border-gray-400 font-medium">#</th>
            <th className="px-4 py-2 text-left border border-gray-400 font-medium">Title</th>
            <th className="px-4 py-2 text-left border border-gray-400 font-medium">Message</th>
            <th className="px-4 py-2 text-left border border-gray-400 font-medium">All User</th>
            <th className="px-4 py-2 text-left border border-gray-400 font-medium">Type</th>
            <th className="px-4 py-2 text-center border border-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {notifications?.map((notification, index) => (
            <tr
              key={notification?.notification_id}
             className="text-gray-800 even:bg-[#c1c1c1b3] "
            >
              <td className="px-4 py-2 text-center border border-gray-400 font-medium text-sm">{index + 1}</td>
              <td className="px-4 py-2 text-justify border border-gray-400 font-medium text-sm">{notification?.title}</td>
              <td className="px-4 py-2 text-justify border border-gray-400 font-medium text-sm">{notification?.message}</td>
              <td className="px-4 py-2 border border-gray-400 font-medium text-sm">{notification?.users ? 'True': 'False'}</td>
              <td className="px-4 py-2 border border-gray-400 font-medium text-sm">{notification?.type}</td>
              <td className="px-4 py-2 text-center border border-gray-400 font-medium text-sm">
                {/* <button
                  onClick={() => handleEdit(notification)}
                  className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                >
                  Edit
                </button> */}
                <button
                  onClick={() => handleDelete(notification?.id)}
                  className="py-1 ml-2 text-red-500 rounded hover:text-red-600"
                  >
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {open && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteNotification}
          id={deleteID}
        />
      )}
      
    </div>
  );
};

export default NotificationsTable;
