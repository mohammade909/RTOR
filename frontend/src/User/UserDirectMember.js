import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReferralTree } from "../redux/referralSlice";
import Loader from "../BaseFile/comman/Loader";

export default function UserDirectMember() {
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { loading, referralTree } = useSelector((state) => state.referralTree);
  const [allRefferal, setAllRefferal] = useState();

  useEffect(() => {
    dispatch(getReferralTree(auth?.refferal_code));
    setAllRefferal(referralTree);
  }, [dispatch, allRefferal, auth?.refferal_code]);

  const handleSearch = (e) => {
    setAllRefferal(
      referralTree?.filter((p) => p.username?.includes(e.target.value))
    );
    setSearchQuery(e.target.value);
  };
  return (
    <>
      <Loader isLoading={loading} />
      <div className="my-5 lg:mx-3 sm:mx-3 p-4 bg-white">
        <div className="flex-wrap w-full mb-3 ">
          <div className="">
            <h3 className="text-lg font-semibold text-gray-800 ">
              Your Member
            </h3>
            <p className="text-lg text-gray-700">
              Overview of the Your Member.
            </p>
          </div>
          <div className="mt-3">
            <div className="relative flex w-full  gap-5">
              <div className="relative w-full">
                <input
                  id="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e)}
                  className="w-full h-10 py-2 pl-3 text-lg transition duration-200 border rounded shadow-sm text-gray-800 bg-white pr-11 placeholder:text-slate-300  border-slate-300 ease focus:outline-none focus:border-slate-400 focus:shadow-md"
                  placeholder="Search for invoice..."
                />
                <button
                  className="absolute flex items-center justify-center h-8 px-2 my-auto rounded jus right-1 top-1"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col w-full h-full mb-4 rounded-sm shadow-md bg-clip-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border rounded-sm table-auto min-w-max">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300">
                <tr>
                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">S. No</p>
                  </th>
                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">
                      UserName
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">
                      is_active
                    </p>
                  </th>

                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">
                      E-Mail
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">
                      Active Plan
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate-200 ">
                    <p className="text-base font-medium leading-none ">
                      Created at
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                {(searchQuery ? allRefferal : referralTree)?.length > 0 ? (
                  (searchQuery ? allRefferal : referralTree)?.map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="text-gray-100 even:bg-[#f0f0f1b3] even:text:white"
                      >
                        <td className="py-4 pl-4 pr-3 text-gray-700 text-lg font-medium whitespace-nowrap sm:pl-3">
                          {index + 1}
                        </td>
                        <td className="py-4 pl-4 pr-3  text-gray-700 text-lg font-medium whitespace-nowrap sm:pl-3">
                          {item?.username}
                        </td>
                        <td className="px-3 py-4 text-lgwhitespace-nowrap">
                          <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                            {item?.is_active === "active" ? (
                              <div className="flex-none p-1 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-800" />
                              </div>
                            ) : (
                              <div className="flex-none p-1 rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-800" />
                              </div>
                            )}
                            <div className="hidden sm:block text-gray-700">
                              {item?.is_active}
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4 text-gray-700 text-lg whitespace-nowrap">
                          {item?.email}
                        </td>
                        <td className="px-3 py-4 text-gray-700 text-lg whitespace-nowrap">
                          ${item?.active_plan}
                        </td>
                        <td className="px-3 py-4 text-gray-700 text-lg whitespace-nowrap">
                          {item?.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-lg text-center text-gray-800"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
