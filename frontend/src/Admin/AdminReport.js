import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeposite } from "../redux/depositeSlice";
import { getAllUsers } from "../redux/userSlice";
import { getAllWithdrawal } from "../redux/withdrawalSlice";
import Loader from "../BaseFile/comman/Loader";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";

export default function AdminReport() {
  const dispatch = useDispatch();
  const { allusers } = useSelector((state) => state.allusers);
  const { allwithdrawal } = useSelector((state) => state.allwithdrawal);
  const { alldeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );

  const [allUser, setAllUser] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllWithdrawal());
    dispatch(getAllDeposite());
  }, [dispatch]);

  function findLastEntryByCreatedAt(arr) {
    return arr?.reduce(
      (acc, current) => (acc.created_at > current.created_at ? acc : current),
      {}
    );
  }

  const combinedArray = allusers?.map((user) => {
    let lastWithdrawal = findLastEntryByCreatedAt(
      allwithdrawal?.filter((w) => w.user_id === user.id)
    );
    let lastDeposit = findLastEntryByCreatedAt(
      alldeposite?.filter((d) => d.user_id === user.id)
    );
    return {
      id: user?.id,
      name: user?.username,
      last_login: user?.last_login,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      active_plan: user?.active_plan,
      activation_date: user?.activation_date,
      last_withdrawal_created_at: lastWithdrawal?.createdAT || null,
      last_withdrawal_amount: lastWithdrawal?.amount || null,
      last_deposit_created_at: lastDeposit?.createdAT || null,
      last_deposit_amount: lastDeposit?.amount || null,
    };
  });

  useEffect(() => {
    setAllUser(combinedArray);
    if (searchQuery) {
      setAllUser(
        combinedArray?.filter((p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, combinedArray]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = (searchQuery ? allUser : combinedArray)?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (searchQuery ? allUser : combinedArray)?.length / itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="my-5 lg:mx-3 sm:mx-3 p-4">
      <div className=" pt-5">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="Search here..."
          className="block w-[50vh] px-2 py-1 rounded-sm  border-gray-300    text-gray-800 bg-white border    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      <div
        className={`${
          loading ? "h-[560px] items-center" : "h-full"
        } overflow-x-auto`}
      >
        {loading ? (
          <Loader />
        ) : (
          <div className="flow-root mt-4">
            <div className="inline-block min-w-full">
              <table className="min-w-full overflow-hidden  divide-y divide-gray-700">
                <thead className="text-lg leading-6 border border-b  text-gray-100 bg-black ">
                  <tr>
                    <th className="py-2 pl-2 pr-8 font-medium text-base border-r  sm:pl-6 lg:pl-8">
                      Name
                    </th>
                    <th className="py-2 pl-2 pr-8 font-medium text-base border-r sm:table-cell">
                      Last Deposit
                    </th>
                    <th className="py-2 pl-2 pr-4 font-medium border-r text-base text-right sm:pr-8 sm:text-left lg:pr-20">
                      Last Withdrawal
                    </th>
                    <th className="py-2 pl-2 pr-4 font-medium border-r text-base text-right sm:pr-8 sm:text-left lg:pr-20">
                      Activation Date
                    </th>
                    <th className="py-2 pl-2 pr-8 font-medium border-r text-base md:table-cell lg:pr-20">
                      Last Update
                    </th>
                    <th className="py-2 pl-2 pr-4 font-medium border-r text-base sm:table-cell sm:pr-6 lg:pr-20">
                      Last Login
                    </th>
                    <th className="py-2 pl-2 pr-4 font-medium border-r text-base sm:table-cell sm:pr-6 lg:pr-20">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white">
                  {currentData?.map((item, index) => (
                    <tr key={index} className="text-gray-800 even:bg-[#d1d0d0b3] ">
                      <td className="py-4 pl-4 border-r border-gray-400 sm:pl-6 lg:pl-8">
                        <div className="flex items-center">
                          <div className="text-base font-medium leading-6 truncate">
                            {item?.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pl-4 border-r border-gray-400 sm:pl-6 lg:pl-8 sm:table-cell sm:pr-8">
                        <div className="font-mono text-base leading-6 ">
                          {new Date(item?.last_deposit_created_at).toLocaleDateString()}
                        </div>
                        <div className="px-2 py-2 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
                          {item?.last_deposit_amount}
                        </div>
                      </td>
                      <td className="py-4 pl-4 border-r border-gray-400 sm:pl-6 lg:pl-8 sm:table-cell sm:pr-8">
                        <div className="font-mono text-base leading-6 ">
                          {new Date(item?.last_withdrawal_created_at).toLocaleDateString()}
                        </div>
                        <div className="px-2 py-2 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
                          {item?.last_withdrawal_amount}
                        </div>
                      </td>
                      <td className="py-4 pl-4 text-base leading-6 border-r border-gray-400 sm:pl-6 lg:pl-8 md:table-cell">
                        {item?.activation_date}
                      </td>
                      <td className="py-4 pl-4 text-base leading-6 border-r border-gray-400 sm:pl-6 lg:pl-8 md:table-cell">
                        {new Date(item?.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 pl-4 text-base leading-6 border-r border-gray-400 sm:pl-6 lg:pl-8 md:table-cell">
                        {new Date(item?.last_login).toLocaleDateString()}
                      </td>
                      <td className="py-4 pl-4 text-base leading-6 border-r border-gray-400 sm:pl-6 lg:pl-8 md:table-cell">
                        {new Date(item?.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between p-4 ">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-5 text-lg py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-green-700 text-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-5 py-1 text-lg rounded-md ${
                    currentPage === totalPages
                      ? "bg-green-700 text-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
