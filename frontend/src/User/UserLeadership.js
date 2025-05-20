import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../BaseFile/comman/Loader";
import { getAllLeadershipByid ,clearErrors,clearMessage } from "../redux/leadershipSlice";
export default function UserLeadershipTransaction() {
  const dispatch = useDispatch();
  const { singleleadership, loading, error, message } = useSelector(
    (state) => state.allleadership
  );
  const { auth } = useSelector((state) => state.auth);
  useEffect(() => {
    if ( auth?.id) {
      const user_id = auth?.id;
      dispatch(getAllLeadershipByid({ user_id }));
    }
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, auth?.id]);
  return (
    <>

      <div className="mx-5">
        <div className="w-full flex justify-between items-center mb-3 pl-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-300">
            Leadership History
            </h3>
            <p className="text-slate-400 text-lg">
              Overview of the Leadership History.
            </p>
          </div>
          <div className="ml-3">
            <div className="w-full flex gap-5 max-w-sm relative">
              <div className="relative">
                <input
                 id="search"
                 name="search"
                  className="bg-black w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-300 text-lg border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                  placeholder="Search for invoice..."
                />
                <button
                  className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-gray-900 rounded"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-300"
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

        <div className="relative flex flex-col mb-4 w-full h-full text-gray-800  shadow-md rounded-lg  px-2 py-1 bg-clip-border">
          {loading ? (
            <Loader />
          ) : (
            <table className="w-full text-left table-auto min-w-max border">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
                  <th className="p-4 border-b border-slate">
                    <p className="text-lg font-normal leading-none text-white">
                    User
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate">
                    <p className="text-lg font-normal leading-none text-white">
                    User By
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate">
                    <p className="text-lg font-normal leading-none text-white">
                    Amount
                    </p>
                  </th>
                  <th className="p-4 border-b border-slate w-16">
                    <p className="text-lg font-normal leading-none text-white">
                    Created At
                    </p>
                  </th>
                
                </tr>
              </thead>
              <tbody className="bg-white hover:black">
              {singleleadership?.length >0 ?(
              singleleadership?.slice()
                          .reverse()
                          .map((item, index) => (
                  <tr key={index} className="">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium text-gray-800 sm:pl-3">
                      {item?.user_email}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-lg font-medium text-gray-800 sm:pl-3">
                      {item?.userby_email} 
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                      ${item?.amount} 
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-800">
                      {item?.created_at} 
                      </td>
                      
                      {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-lg font-medium sm:pr-6">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    <FiEdit
                      className="h-5 w-5 inline-block"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Edit {person.name}</span>
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-900 ml-4">
                    <TrashIcon
                      className="h-5 w-5 inline-block"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Delete {person.name}</span>
                  </a>
                </td> */}
                    </tr>
                  ))) :(
                    <tr>
                      <td
                        colSpan="7"
                        className="py-4 text-center text-lg text-gray-400 bg-red-900/50"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          )}
        </div>
      </div>
     
    </>
  );
}
