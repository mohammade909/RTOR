import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { addTicketResponse, fetchTicketById } from "../../redux/ticketSlice";
import { Formik, Field, Form } from "formik";

const QueryChat = () => {
  const { ticketId } = useParams();
  const dispatch = useDispatch();

  // Access ticket data from Redux store
  const { ticket, loading, error } = useSelector((state) => state.tickets);

  // Get the user_id from auth state
  const { auth } = useSelector((state) => state.auth);
  const { id:user_id, name: username } = auth;
  
  const [responses, setResponses] = useState(ticket?.responses || []);

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
  }, [responses]);

  // Formik initial values
  const initialValues = {
    message: "",
    from: user_id,
    to: 1, // Set the recipient user ID (assuming creator of the ticket)
  };

  const handleSendResponse = (values, { resetForm }) => {
    if (!values.message.trim()) return; // Prevent sending empty messages
    
    dispatch(addTicketResponse({ ticketId, responseData: values }));
    dispatch(fetchTicketById(ticketId));
    resetForm();
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

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Error Loading Conversation</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link to="/queries" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200">
              Return to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          to="/user/queries" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Tickets
        </Link>
        
        {/* Ticket Details Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Ticket #{ticketId}</h1>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(ticket?.status)}`}>
                  {ticket?.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(ticket?.priority)}`}>
                  {ticket?.priority}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{ticket?.subject}</h2>
            <p className="text-gray-700 mb-4 pb-4 border-b border-gray-100">{ticket?.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                  <span className="font-medium text-indigo-700">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <span>Created by you</span>
              </div>
              
              {ticket?.created_at && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(ticket.created_at)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Conversation</h2>
          </div>
          
          {/* Messages Container */}
          <div 
            className="p-6 space-y-6 overflow-y-auto" 
            style={{ maxHeight: "500px", minHeight: "300px" }}
          >
            {responses && responses.length > 0 ? (
              responses.map((response) => {
                const isCurrentUser = response.from.user_id === user_id;
                return (
                  <div 
                    key={response.response_id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                      {/* Message Bubble */}
                      <div 
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          isCurrentUser 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{response.message}</p>
                      </div>
                      
                      {/* Message Meta */}
                      <div className={`mt-1 flex items-center text-xs text-gray-500 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-medium mr-2">{response.from.username}</span>
                        <span>{formatDate(response.created_at)}</span>
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrentUser 
                        ? 'bg-indigo-100 text-indigo-700 mr-3 order-1' 
                        : 'bg-gray-200 text-gray-700 ml-3 order-2'
                    }`}>
                      {response.from.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Form */}
          <div className="border-t border-gray-100 p-6">
            {ticket?.status === "closed" || ticket?.status === "resolved" ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-gray-600 font-medium">This conversation is {ticket?.status}.</p>
                <p className="text-gray-500 text-sm mt-1">You cannot reply to this ticket anymore.</p>
              </div>
            ) : (
              <Formik initialValues={initialValues} onSubmit={handleSendResponse}>
                {({ values, handleChange, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="relative">
                      <Field
                        as="textarea"
                        id="message"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        className="w-full p-4 pr-20 border text-gray-700 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                        placeholder="Type your message here..."
                        rows="3"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !values.message.trim()}
                        className={`absolute bottom-3 right-3 rounded-lg p-2 ${
                          values.message.trim() 
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        } transition duration-200`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryChat;