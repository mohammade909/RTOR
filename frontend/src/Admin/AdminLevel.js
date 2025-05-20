import { Link } from "react-router-dom";
import { useState ,useEffect} from "react";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { useParams } from "react-router-dom";
const leveldata = [
  {
    id: 1,
    level: "parth Walton",
    level_month: "1323425.45",
    referral_required: "lorem ipsum dolor sit amet, consectetur adip",
  },
  {
    id: 2,
    level: "parth Walton",
    level_month: "1323425.45",
    referral_required: "lorem ipsum dolor sit amet, consectetur adip",
  },
  {
    id: 3,
    level: "parth Walton",
    level_month: "1323425.45",
    referral_required: "lorem ipsum dolor sit amet, consectetur adip", },
  {
    id: 4,
    level: "parth Walton",
    level_month: "1323425.45",
    referral_required: "lorem ipsum dolor sit amet, consectetur adip",},
  {
    id: 5,
    level: "parth Walton",
    level_month: "1323425.45",
    referral_required: "lorem ipsum dolor sit amet, consectetur adip",}
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLevel() {
  const [allLevelData, setAllLevelData] = useState(leveldata);
  const [searchQuery, setSearchQuery] = useState("");
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
    setAllLevelData(leveldata?.filter((p) => p.email?.includes(e.target.value)));
    setSearchQuery(e.target.value);
  };
  return (
    <div className="bg-gray-900 ">
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
          <col className="w-full sm:w-1/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-lg leading-6 text-white">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 font-semibold sm:pl-6 lg:pl-8"
            >
              ID
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
             Level
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Level Income
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Referral Required
            </th>
           
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-4 font-semibold sm:table-cell sm:pr-6 lg:pr-8"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {allLevelData?.map((item, index) => (
            <tr key={index}>
              <td className="py-4 pl-4  sm:pl-6 lg:pl-8">
                <div className="flex items-center">
                  <div className="truncate text-lg font-medium leading-6 text-white">
                    {item?.id}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="">
                  <div className="font-mono text-lg leading-6 text-gray-400">
                    ${item?.level}{" "}
                  </div>
                  
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="">
                  <div className="font-mono text-lg leading-6 text-gray-400">
                    {item?.level_month}{" "}
                  </div>
                 
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-lg leading-6 text-gray-400 md:table-cell lg:pr-20">
                {item?.referral_required}
              </td>
             
              <td className="py-4 pl-0 pr-4 text-right text-lg leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                <div className="z-0 flex space-x-4">
                  <IconContainer to={`/refferal/${item?.id}`}>
                    <GrEdit />
                  </IconContainer>
                  <IconContainer
                    to={`/refferal/${item?.id}`}
                    color="text-green-400"
                  >
                    <GrView />
                  </IconContainer>
                  <IconContainer
                    to={`/refferal/${item?.id}`}
                    color="text-red-400"
                  >
                    <AiFillDelete />
                  </IconContainer>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
