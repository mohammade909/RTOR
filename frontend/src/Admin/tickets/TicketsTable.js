import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets } from "../../redux/ticketSlice";
import { Link } from "react-router-dom";
const TicketsTable = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);

  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...tickets];

    // Filter by search term (username or email)
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          (ticket.creator.username &&
            ticket.creator.username
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (ticket.creator.email &&
            ticket.creator.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter(
        (ticket) => ticket.priority === priorityFilter
      );
    }

    // Filter by date range
    if (dateFilter.start && dateFilter.end) {
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      filtered = filtered.filter(
        (ticket) =>
          new Date(ticket.created_at) >= startDate &&
          new Date(ticket.created_at) <= endDate
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, dateFilter]);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error loading tickets: {error}</p>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Ticket List</h1>

      {/* Search Bar and Filters */}
      <div className="mb-4 flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            className="p-2 border border-gray-300 rounded"
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Status Filter */}
          <select
            className="p-2 border border-gray-300 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In-progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            className="p-2 border border-gray-300 rounded"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex space-x-4">
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={dateFilter.start}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, start: e.target.value })
            }
          />
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={dateFilter.end}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, end: e.target.value })
            }
          />
        </div>
      </div>
      <hr className="mb-6" />
      {/* Tickets Display */}
      {!loading && !error && filteredTickets?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTickets.map((ticket, index) => (
            <div
              key={ticket.ticket_id}
              className="bg-white border-l-4 border-blue-500 rounded-xl shadow-lg p-5 relative"
            >
              <div className="absolute -top-4 -left-4 bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                #{index+1}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {ticket.subject}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Description:</span>{" "}
                {ticket.description}
              </p>
              <div className="flex justify-between text-sm mb-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      ticket.status === "open"
                        ? "bg-green-100 text-green-600"
                        : ticket.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : ticket.status === "resolved"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Priority:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      ticket.priority === "low"
                        ? "bg-green-100 text-green-600"
                        : ticket.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Creator:</span>{" "}
                {ticket.creator.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(ticket.created_at).toLocaleString()}
              </p>

              {/* View Details Button */}
              <div className="mt-4">
                <Link
                  to={`/admin/ticket/${ticket.ticket_id}`}
                  className="inline-block bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No tickets available.</p>
      )}
    
    </div>
  );
};

export default TicketsTable;
