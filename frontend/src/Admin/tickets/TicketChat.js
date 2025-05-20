import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  addTicketResponse,
  fetchTicketById,
  updateTicketStatus,
} from "../../redux/ticketSlice";
import { Formik, Field, Form } from "formik";

const TicketChat = () => {
  const { ticketId } = useParams();
  const dispatch = useDispatch();

  // Access ticket data from Redux store
  const { ticket, loading, error } = useSelector((state) => state.tickets);

  // Get the user_id from auth state
  const { auth } = useSelector((state) => state.auth);
  const id = auth?.id;
  const [responses, setResponses] = useState(ticket?.responses || []);

  // State for status dropdown
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  // Create a ref for the messages container to control scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [ticketId, dispatch]);

  useEffect(() => {
    if (ticket?.responses) {
      // Create a copy of the responses array and sort it in ascending order by created_at
      const sortedResponses = [...ticket.responses].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setResponses(sortedResponses);
    }
  }, [ticket]);

  useEffect(() => {
    // Scroll to the bottom whenever responses change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]); // This effect runs whenever responses state changes

  // Formik initial values
  const initialValues = {
    message: "", // Start with an empty message field
    from: 1, // Use the actual logged-in user ID
    to: ticket?.creator?.user_id, // Set the recipient user ID
  };

  const handleSendResponse = (values, { resetForm }) => {
    if (!values.message.trim()) return;

    dispatch(addTicketResponse({ ticketId, responseData: values }));
    dispatch(fetchTicketById(ticketId));
    resetForm();
  };

  // Status update handler (mock function - implement actual API call)
  const updateStatus = (newStatus) => {
    console.log(`Updating status to: ${newStatus}`);
    dispatch(updateTicketStatus({ ticketId, status: newStatus }));
    // Add your actual status update logic here
    setStatusDropdownOpen(false);
  };

  // Priority update handler (mock function - implement actual API call)
  const updatePriority = (newPriority) => {
    console.log(`Updating priority to: ${newPriority}`);
    // Add your actual priority update logic here
    setPriorityDropdownOpen(false);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Status badge style helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "in-progress":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "resolved":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // Priority badge style helper
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "low":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "high":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Error Loading Ticket
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link
              to="/admin/tickets"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Return to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log(responses);
  return (
    <>
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/admin/tickets"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
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
              Back to All Tickets
            </Link>

            <div className="text-sm text-gray-500">Admin View</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Details Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                <div className="bg-indigo-600 px-6 py-4">
                  <h1 className="text-xl font-bold text-white">
                    Ticket #{ticketId}
                  </h1>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Ticket Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {ticket?.subject}
                      </h2>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-700 mb-4">
                        {ticket?.description}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="mt-1 relative">
                        <button
                          type="button"
                          className={`inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getStatusStyle(
                            ticket?.status
                          )}`}
                          onClick={() =>
                            setStatusDropdownOpen(!statusDropdownOpen)
                          }
                        >
                          <span>{ticket?.status}</span>
                          <svg
                            className="h-5 w-5 ml-2 -mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {statusDropdownOpen && (
                          <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              {[
                                "open",
                                "in-progress",
                                "resolved",
                                "closed",
                              ].map((status) => (
                                <button
                                  key={status}
                                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                    ticket?.status === status
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                  onClick={() => updateStatus(status)}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Priority Management */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <div className="mt-1 relative">
                        <button
                          type="button"
                          className={`inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${getPriorityStyle(
                            ticket?.priority
                          )}`}
                          onClick={() =>
                            setPriorityDropdownOpen(!priorityDropdownOpen)
                          }
                        >
                          <span>{ticket?.priority}</span>
                          <svg
                            className="h-5 w-5 ml-2 -mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {priorityDropdownOpen && (
                          <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              {["low", "medium", "high"].map((priority) => (
                                <button
                                  key={priority}
                                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                    ticket?.priority === priority
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                  onClick={() => updatePriority(priority)}
                                >
                                  {priority}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-medium text-indigo-800 mb-2">
                        Ticket Creator
                      </h3>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                          <span className="text-indigo-700 font-medium">
                            {ticket?.creator?.username
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {ticket?.creator?.username || "User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ticket?.creator?.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Meta Information */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created:</span>
                        <span>
                          {ticket?.created_at
                            ? formatDate(ticket.created_at)
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Last Updated:</span>
                        <span>
                          {ticket?.updated_at
                            ? formatDate(ticket.updated_at)
                            : "Not updated"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Admin Actions
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <button className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Activity Log
                  </button>
                  <button className="w-full flex items-center justify-center bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                    </svg>
                    Transfer Ticket
                  </button>
                  <button className="w-full flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    Conversation
                  </h2>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  className="p-6 space-y-6 overflow-y-auto"
                  style={{ height: "600px" }}
                >
                  {responses && responses.length > 0 ? (
                    responses.map((response) => {
                      const isCurrentUser = response.from.user_id === 1;
                      return (
                        <div
                          key={response.response_id}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-md ${
                              isCurrentUser ? "order-2" : "order-1"
                            }`}
                          >
                            {/* Message Bubble */}
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm ${
                                isCurrentUser
                                  ? "bg-indigo-600 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-800 rounded-bl-none"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {response.message}
                              </p>
                            </div>

                            {/* Message Meta */}
                            <div
                              className={`mt-1 flex items-center text-xs text-gray-500 ${
                                isCurrentUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span
                                className={`font-medium ${
                                  isCurrentUser ? "text-indigo-500" : ""
                                }`}
                              >
                                {isCurrentUser
                                  ? "You (Admin)"
                                  : response.from.username}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(response.created_at)}</span>
                            </div>
                          </div>

                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCurrentUser
                                ? "bg-indigo-100 text-indigo-700 mr-3 order-1"
                                : "bg-gray-200 text-gray-700 ml-3 order-2"
                            }`}
                          >
                            {response.from.username?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mb-3 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p>No messages in this conversation yet.</p>
                      <p className="text-sm mt-1">
                        Send the first response to get started.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <div className="border-t border-gray-100 p-6">
                  <Formik
                    initialValues={initialValues}
                    onSubmit={handleSendResponse}
                  >
                    {({ values, handleChange, isSubmitting }) => (
                      <Form>
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Reply as Admin
                            </label>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                className="text-indigo-600 hover:text-indigo-700 text-sm"
                              >
                                Add Template
                              </button>
                              <button
                                type="button"
                                className="text-indigo-600 hover:text-indigo-700 text-sm"
                              >
                                Add File
                              </button>
                            </div>
                          </div>
                          <Field
                            as="textarea"
                            id="message"
                            name="message"
                            value={values.message}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                            placeholder="Type your response here..."
                            rows="4"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              Attach
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                              Templates
                            </button>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => updateStatus("closed")}
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Close Ticket
                            </button>

                            <button
                              type="submit"
                              disabled={isSubmitting || !values.message.trim()}
                              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                values.message.trim()
                                  ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  : "bg-indigo-300 cursor-not-allowed"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                              </svg>
                              Send Response
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketChat;
