import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getAllDepositeByid } from "../redux/depositeSlice";
import { getAllWithdrawalByid } from "../redux/withdrawalSlice";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/20/solid";

export default function UserTransaction() {
  const dispatch = useDispatch();
  const { singleDeposite, loading } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getAllDepositeByid(auth?.id));
      dispatch(getAllWithdrawalByid(auth?.id));
    }
  }, [auth?.id, dispatch]);

  const depositsWithType =
    singleDeposite?.map((deposit) => ({ ...deposit, type: "deposit" })) || [];
  const withdrawalsWithType =
    singleWithdrawal?.map((withdrawal) => ({
      ...withdrawal,
      type: "withdrawal",
    })) || [];

  let combinedArray = [...depositsWithType, ...withdrawalsWithType];
  combinedArray.sort((a, b) => new Date(b.createdAT) - new Date(a.createdAT));
  combinedArray = combinedArray.slice(0, 8); // Take only the latest 8 transactions

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-red-400";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <div className="w-full overflow-hidden ">
        <div className="">
          <h2 className="font-semibold text-gray-800 mb-2">Transaction History</h2>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full divide-y divide-blue-800">
            <thead className=" sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  Accept At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-blue-800">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800 divide-y">
              {combinedArray.length > 0 ? (
                combinedArray.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={
                      index % 2 === 0
                        ? "bg-blue-900 bg-opacity-10"
                        : "bg-blue-900 bg-opacity-20"
                    }
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {formatDate(transaction.createdAT)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {transaction.type === "deposit" ? (
                          <ArrowDownIcon className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <ArrowUpIcon className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span
                          className={
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          transaction.type === "deposit"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "deposit" ? "+" : "-"} $
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      {transaction.acceptat || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {transaction.status === "complete" ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-1" />
                        ) : transaction.status === "pending" ? (
                          <ClockIcon className="h-5 w-5 text-yellow-600 mr-1" />
                        ) : (
                          <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-1" />
                        )}
                        <span className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-800 bg-white "
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ExclamationCircleIcon className="h-8 w-8 text-gray-800 mb-2" />
                      <p>No transaction data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
