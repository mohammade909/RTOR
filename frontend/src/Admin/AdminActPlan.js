import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import Loader from "../BaseFile/comman/Loader";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Spinner from "../BaseFile/comman/Spinner";

import {
  getAllActPlan,
  clearErrors,
  deleteActPlan,
  clearMessage,
} from "../redux/actplanSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AdminActPlan() {
  const dispatch = useDispatch();
  const { allactplans, loading, error, message } = useSelector(
    (state) => state.allactplans
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [deleteID, setdeleteID] = useState();

  useEffect(() => {
    dispatch(getAllActPlan());
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
  }, [dispatch, error, message, clearErrors, clearMessage]);



  function isClose() {
    setModalopen(false);
  }
  function handleDelete(id) {
    setdeleteID(id);
    if (deleteID) {
      console.log(id);
      setModalopen(true);
    }
  }

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
              <Radio
                onClick={() => setAnnual(true)}
                className="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 data-[checked]:bg-indigo-600 data-[checked]:text-white"
              >
                Monthly
              </Radio>
              <Radio
                onClick={() => setAnnual(false)}
                className="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 data-[checked]:bg-indigo-600 data-[checked]:text-white"
              >
                Yearly
              </Radio>
            </RadioGroup>
          </fieldset>
        </div>
        <div className=" isolate mx-auto mt-10 grid max-w-md grid-cols-1  gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
          {allactplans?.map((allPlan) => (
            <div className="transition-transform duration-300 p-8 border border-blue-700 rounded-2xl transform hover:scale-105">
              <div className="flex justify-between">
                <h3 className="text-center text-2xl capitalize font-semibold" >{allPlan?.name}</h3>
              <AiFillDelete
                        className="h-4 w-4 text-red-700 cursor-pointer mt-2"
                        onClick={() => handleDelete(allPlan?.id)}
                        title="Delete"
                      />
              </div>
              <div key={allPlan?.id}>
                <p className="mt-4 text-lg leading-6 text-gray-600">
                  {allPlan?.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  {annual
                    ? `${allPlan?.monthly_price} /month`
                    : `${allPlan?.monthly_price * 12 - (allPlan?.monthly_price * 12 / 100) * allPlan?.yearly_discount} /year`}
                </span>

                </p>

                <ul
                  role="list"
                  className="mt-8 space-y-3 text-lg leading-6 text-gray-600"
                >
                  <li className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-indigo-600"
                    />
                    {allPlan?.ROI_day} % ROI per Day
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-indigo-600"
                    />
                    {allPlan?.ROI_overall} % ROI Overall
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-indigo-600"
                    />
                    {allPlan?.Sponser_bonus} % Sponser Bonus
                  </li>
                  <li className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-5 flex-none text-indigo-600"
                    />
                    {allPlan?.plan_period} Month Plan Period
                  </li>
                </ul>
                <Link to={`/admin/editactplan/${allPlan?.id}`}
                  className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 mt-6 block rounded-md px-3 py-2 text-center text-lg font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? <Spinner /> : " Edit Plan"}

                 
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>)}
    
    {modalopen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteActPlan}
          id={deleteID}
        />
      )}</>
  );
}
