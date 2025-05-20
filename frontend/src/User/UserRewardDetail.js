import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../BaseFile/comman/Loader";
import { getUser } from "../redux/userSlice";


const thresholds = [2500, 5000, 10000, 20000, 50000, 100000, 200000, 500000];
const rewardValues = [50, 100, 200, 500, 1250, 3000, 8000,25000];
const salleryValues = [25, 50, 100, 200, 500, 1500, 3000, 10000];
const UserRewardDetail = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, singleuser } = useSelector((state) => state.allusers);

  useEffect(() => {
    dispatch(getUser(auth?.id));
  }, [dispatch, auth?.id]);
  const reward_level = singleuser?.reward_level || 0;

  return (
    <>
      <div className="m-3 p-4">
        <div className="relative flex flex-col w-full h-full px-3 py-1 mb-4 text-gray-200 shadow-md bg-clip-border">
          {loading ? (
              <Loader isLoading={loading}/>
          ) : (
            <div className="px-2 overflow-x-auto">
        <h1 className="py-3">Reward Detail</h1>

              <table className="w-full text-left border table-auto min-w-max text-gray-100">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500">
                  <tr>
                    <th className="p-2 border-b md:p-4 border-slate-200 ">
                      <p className="text-xs font-normal leading-none md:text-lg">
                        ID
                      </p>
                    </th>
                    <th className="p-2 border-b md:p-4 border-slate-200 ">
                      <p className="text-xs font-normal leading-none md:text-lg">
                        Required Amount
                      </p>
                    </th>
                    <th className="p-2 border-b md:p-4 border-slate-200 ">
                      <p className="text-xs font-normal leading-none md:text-lg">
                      Salary Amount
                      </p>
                    </th>
                    <th className="p-2 border-b md:p-4 border-slate-200 ">
                      <p className="text-xs font-normal leading-none md:text-lg">
                        Reward Amount
                      </p>
                    </th>
                    <th className="p-2 border-b md:p-4 border-slate-200 ">
                      <p className="text-xs font-normal leading-none md:text-lg">
                        Business Ratio
                      </p>
                    </th>
                   
                    <th className="p-2 text-center border-b md:p-4 border-slate-200">
                      <p className="text-xs font-normal leading-none text-center md:text-lg">
                        Achieve
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 bg-white">
                  {thresholds?.length > 0 ? (
                  thresholds.map((item, index) => {
                    return (
                      <tr key={index} className="text-gray-800">
                        <td className="py-2 pl-4 pr-3 text-xs font-medium text-gray-800 whitespace-nowrap md:py-4 md:text-lg sm:pl-3">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 text-xs whitespace-nowrap md:py-4 md:text-lg">
                          ${item}
                        </td>
                       
                        <td className="px-3 py-2 text-xs whitespace-nowrap md:py-4 md:text-lg">
                          ${salleryValues[index]}
                        </td>
                         <td className="px-3 py-2 text-xs whitespace-nowrap md:py-4 md:text-lg">
                          ${rewardValues[index]}
                        </td>
                        <td className="px-3 py-2 text-xs whitespace-nowrap md:py-4 md:text-lg">
                          40% : 30% : 30%
                        </td>
                        
                        <td className="px-3 py-2 text-xs text-center whitespace-nowrap md:py-4 md:text-lg">
                          {reward_level <= index ? (
                            <div className="p-2 text-white border rounded bg-[#7e66c5b3]">
                              {" "}
                              Remain{" "}
                            </div>
                          ) : (
                            <div className="p-2 text-black bg-green-300 rounded">
                              {" "}
                              Archive{" "}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })):(
                    <tr>
              <td
                colSpan={6} 
                className="py-4 text-lg font-medium text-center text-gray-800 whitespace-nowrap bg-[#4b1725ab]"
              >
                No data available
              </td>
            </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserRewardDetail;
