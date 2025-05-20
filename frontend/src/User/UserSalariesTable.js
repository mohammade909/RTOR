import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UserSalariesTable = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const { auth } = useSelector((state) => state.auth);
 
  const fetchSalaries = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/salary/user-salaries",
        {
          params: { 
            user_id: auth.id,
            page: page 
          },
        }
      );
      setData(res.data.data);
      setPagination({
        total: res.data.total,
        totalPages: res.data.total_pages,
        currentPage: res.data.current_page,
        perPage: res.data.per_page,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="min-w-full text-sm text-gray-700 text-left">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 text-white border-blue-500 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Username</th>
              <th className="p-3">Salary ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Remaining</th>
              <th className="p-3">Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b text-gray-800 hover:bg-gray-50 bg-white">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.username}</td>
                  <td className="p-3">{item.salary_id}</td>
                  <td className="p-3">{item.salary_amount}</td>
                  <td className="p-3">{item.duration}</td>
                  <td className="p-3">{item.remaining}</td>
                  <td className="p-3">
                    {new Date(item.assigned_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${
                pagination.currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => fetchSalaries(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSalariesTable;