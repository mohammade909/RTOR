import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { getReferralTree } from "../redux/referralSlice";


export default function AdminRefferal() {
  const [searchQuery, setSearchQuery] = useState("");
  const { referral_code } =useParams()
  const dispatch = useDispatch();
  const { referralTree } = useSelector(
    (state) => state.referralTree
  );
  const [allRefferal, setAllRefferal] = useState(referralTree);


  useEffect(() => {
    dispatch(getReferralTree(referral_code));
    setAllRefferal(referralTree)
  }, [dispatch, allRefferal,referral_code]);


  const IconContainer = ({ to, children, color }) => (
    <div className="z-0 relative flex items-center justify-center">
      <Link
        to={to}
        className={`text-[15px] ${color} transition-transform duration-300 transform hover:scale-150`}
      >
        {children}
      </Link>
    </div>
  );

  const handleSearch = (e) => {
    setAllRefferal(referralTree?.filter((p) => p.username?.includes(e.target.value)));
    setSearchQuery(e.target.value);
  };
  return (
    <div className="bg-gray-900 pt-3">
      <div className="px-8 pt-5">
        <label htmlFor="email" className="sr-only">
          Search
        </label>
        <input
          id="search"
          name="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          type="text"
          placeholder="search here . . ."
          className="block w-[50vh] px-2 py-1 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
        />
      </div>
      <table className="z-10 mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-lg leading-6 text-white">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              UserName
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
             is_active
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Status
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
            >
              email
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8"
            >
              Created at
            </th>
           
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {(searchQuery ? allRefferal : referralTree)?.map((item, index) => (
            <tr key={index}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    alt=""
                    src="/default.png"
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-lg font-medium leading-6 text-white">
                    {item?.username}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-lg leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  {item?.is_active == "active" ? (
                    <div className="flex-none rounded-full p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-800" />
                    </div>
                  ) : (
                    <div className="flex-none rounded-full p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-800" />
                    </div>
                  )}

                  <div className="hidden text-white sm:block">
                    {item?.is_active}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-lg leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  {item?.status == "unblock" ? (
                    <div className="flex-none rounded-full p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-800" />
                    </div>
                  ) : (
                    <div className="flex-none rounded-full p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-800" />
                    </div>
                  )}

                  <div className="hidden text-white sm:block">
                    {item?.status}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-lg leading-6 text-gray-400 md:table-cell lg:pr-20">
                {item?.email}
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-lg leading-6 text-gray-400 md:table-cell lg:pr-20">
                {item?.created_at}
              </td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
