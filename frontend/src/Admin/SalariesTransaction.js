import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { format } from "date-fns";

const SalaryTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const fetchTransactions = async (filterValues = {}, currentPage = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.r2rgloble.com/api/v1/salary/transactions`, {
        params: {
          ...filterValues,
          page: currentPage,
        },
      });
      
      setTransactions(response.data.data);
      setMeta({
        total: response.data.total,
        totalPages: response.data.total_pages,
        currentPage: response.data.current_page,
      });
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(filters, page);
  }, [filters, page]);

  const handleSubmit = (values) => {
    setFilters(values);
    setPage(1); // reset to first page when filters change
  };

  return (
    <div className="p-4 bg-gray-50 h-screen">
      <h2 className="text-xl font-bold mb-4">Salary Transactions</h2>

      {/* Filter Form */}
      <Formik
        initialValues={{
          user_id: "",
          salary_id: "",
          date_from: "",
          date_to: "",
          min_amount: "",
          max_amount: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Field
            name="user_id"
            className="p-2 border rounded"
            placeholder="User ID"
          />
          <Field
            name="salary_id"
            className="p-2 border rounded"
            placeholder="Salary ID"
          />
          <Field
            name="date_from"
            type="date"
            className="p-2 border rounded"
          />
          <Field
            name="date_to"
            type="date"
            className="p-2 border rounded"
          />
          <Field
            name="min_amount"
            type="number"
            className="p-2 border rounded"
            placeholder="Min Amount"
          />
          <Field
            name="max_amount"
            type="number"
            className="p-2 border rounded"
            placeholder="Max Amount"
          />

          <button
            type="submit"
            className="col-span-2 md:col-span-1 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Filter
          </button>
        </Form>
      </Formik>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Salary Amount</th>
              <th className="border px-4 py-2">Paid Amount</th>
              <th className="border px-4 py-2">Transaction Date</th>
              <th className="border px-4 py-2">Required Directs</th>
            </tr>
          </thead>
          <tbody>
            {!loading && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="border px-4 py-2">{tx.id}</td>
                  <td className="border px-4 py-2">{tx.username}</td>
                  <td className="border px-4 py-2">{tx.salary_amount}</td>
                  <td className="border px-4 py-2">{tx.paid_amount}</td>
                  <td className="border px-4 py-2">
                    {format(new Date(tx.transaction_date), "yyyy-MM-dd")}
                  </td>
                  <td className="border px-4 py-2">{tx.required_directs}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  {loading ? "Loading..." : "No transactions found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                i + 1 === meta.currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
            disabled={page === meta.totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SalaryTransactionsTable;
