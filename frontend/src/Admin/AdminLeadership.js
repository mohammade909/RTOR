import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import Loader from "../BaseFile/comman/Loader";
import {
  getAllLeadership,
  deleteleadership,
  clearErrors,
  clearMessage,
} from "../redux/leadershipSlice"
import { Confirmation } from "../BaseFile/comman/Confirmation";

export default function AdminLeadership() {
  const dispatch = useDispatch();
  const [allLeadership, setAllLeadership] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const { allleadership, loading, error, message } = useSelector(
    (state) => state.allleadership
  );

  useEffect(() => {
    dispatch(getAllLeadership());
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
  }, [dispatch, error, message]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setAllLeadership(
        allleadership?.filter((p) =>(p?.user_email).includes(e.target.value))
    );
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };



  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <div className="bg-gray-900 ">
      <div className="px-8 pt-5">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          type="number"
          placeholder="search here . . ."
          className="block w-[50vh] px-2 py-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>
      <div className="mt-4 flow-root">
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full py-2 align-middle ">
            <table className="z-10 mt-6 w-full whitespace-nowrap text-left">
              <thead className="border-b border-white/10 text-lg leading-6 text-white">
                <tr>
                  <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
                    User
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                    User By
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                  Amount
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                   At
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(searchQuery ? allLeadership : allleadership )?.slice()
                          .reverse()
                          .map((item, index) => (
                  
                  <tr key={index}>
                    <td className="py-4 pl-4 sm:pl-6 lg:pl-8">
                      <div className="flex items-center">
                        <div className="truncate text-lg cursor-pointer  font-medium leading-6 text-white">
                        {item?.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                      <div className="">
                        <div className="font-mono text-lg leading-6 text-gray-400">
                          ${item?.userby_email} 
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                      <div className="">
                        <div className="font-mono text-lg leading-6 text-gray-400">
                          ${item?.amount} 
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                      <div className="">
                        <div className="rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10">
                          {item?.created_at} 
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 pl-0 pr-4 text-right text-lg leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      <div className="z-0 flex space-x-4">
                       
                            <AiFillDelete
                              className="h-4 w-4 text-red-400 cursor-pointer"
                              onClick={() => handleDelete(item?.id)}
                              title="Delete"
                            />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteleadership}
          id={deleteID}
        />
      )}
    </div>  )}</>
  );
}
