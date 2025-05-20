import { useState, useEffect } from "react";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { RiLoginCircleFill } from "react-icons/ri";
import Loader from "../BaseFile/comman/Loader";
import { getAllNonUsers,clearErrors,clearMessage } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import SendRewardNotiModel from "./SendRewardNotiModel";

export default function DefaulterUsers() {
  const dispatch = useDispatch();
  const { allnonusers, loading ,error,message} = useSelector((state) => state.allusers);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    dispatch(getAllNonUsers());
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


  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchQuery(searchTerm);
  };
  const handleNoti = (id) => {
    setUserId(id);
  };
  const isClose = () => {
    setUserId(null);
  };

  return (
    <div className=" px-4 mt-4">
      <div className="pt-5">
        <label htmlFor="email" className="sr-only">
          Search using email
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="search here . . ."
          className="block w-full md:max-w-sm  rounded-sm  border-gray-300    text-gray-800 bg-white px-2 py-2 border shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
        />
      </div>
     
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      <div className={` ${loading ? "h-[560px] items-center" : "h-full"}`}>
        {loading ? (
          <Loader />
        ) : (
          <div className="mt-4 flow-root">
            <div className="overflow-x-auto">
              <div className="py-2">
                <table className="divide-y divide-gray-700 w-full border border-gray-700">
                  <thead className="border-b border-white/10 text-gray-100 bg-black text-base leading-6 ">
                    <tr>
                      <th className="px-2 ml-4 text-left  border font-medium border-gray-700">
                        S.No
                      </th>
                      <th className="px-2 ml-4 text-left text-white border font-medium border-gray-700">
                        E-mail
                      </th>
                      <th className="px-2 py-4 text-white border border-gray-700 font-medium text-center">
                        Username
                      </th>
                      <th className="px-2 py-4 text-white border border-gray-700 font-medium text-center">
                        Fullname
                      </th>
                      <th className="px-2 py-4 text-center text-white border font-medium border-gray-700">
                       Title
                      </th>
                      <th className="px-2 py-4 text-center text-white border font-medium border-gray-700">
                        Amount
                      </th>
                      <th className="px-2 py-4 text-center text-white border font-medium border-gray-700">
                        Created at
                      </th>
                      <th className="px-2 py-4 text-center text-white border font-medium border-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white  divide-white/5">
                    {allnonusers?.map((item, index) => (
                      <tr
                        key={index}
                        className="text-gray-800 even:bg-[#d1d0d0b3]  transition-colors duration-200"
                      >
                         <td className="px-4 py-4 text-center  border border-gray-700">
                          <div className="text-base ">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {item?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {item?.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {item?.fullname}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {item?.title || "NA"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {item?.amount || "NA"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-left  border border-gray-700">
                          <div className="tems-center justify-center gap-x-4">
                            <div className="truncate text-base font-medium leading-6  w-full">
                              {(item?.created_at)?.slice(0,10) || "NA"}
                            </div>
                          </div>
                        </td>
                       
                        <td className="px-4 py-4 text-center  border border-gray-700">
                          <div className="flex justify-center items-center space-x-2">
                            <button onClick={() => handleNoti(item.id)}>
                              <RiLoginCircleFill className="text-indigo-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

    
      {userId && (
        <SendRewardNotiModel
          userId={userId}
          isClose={isClose}
        />
      )}

    
    </div>
  );
}
