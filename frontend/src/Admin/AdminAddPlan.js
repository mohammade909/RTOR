import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import {
  getAllPlans,
  addPlan,
  addactivelevel,
  addinvestlevel,
  clearErrors,
  clearMessage,
} from "../redux/planSlice";

export default function AdminAddPlan() {
  const dispatch = useDispatch();
  const { allplans, loading, error, message } = useSelector(
    (state) => state.allplans
  );
  const [values, setValues] = useState({});
  const [values2, setValues2] = useState({});
  const [values3, setValues3] = useState({});

  useEffect(() => {
    dispatch(getAllPlans());
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setValues2((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange3 = (e) => {
    const { name, value } = e.target;
    setValues3((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSaveChanges = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      console.log(values);
      dispatch(addPlan({ values: values }));
    } else {
      form.reportValidity();
    }
  };
  const handleSaveChanges2 = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      console.log(values);
      dispatch(addactivelevel({ values: values2 }));
    } else {
      form.reportValidity();
    }
  };
  const handleSaveChanges3 = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      console.log(values);
      dispatch(addinvestlevel({ values: values3 }));
    } else {
      form.reportValidity();
    }
  };
  return (
    <>
      <div className={`${loading ? "h-[560px] items-center" : "h-full"}`}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="h-[2px] bg-gray-800 w-full" />
            <div className="bg-gray-100">
              <div className="max-w-7xl mx-auto bg-white rounded shadow overflow-hidden">
                {message && <SuccessAlert message={message} />}
                {error && <ErrorAlert error={error} />}
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold mb-5 text-gray-800 mb-2">
                    Editable Details
                  </h2>
                  <form>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Package
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="monthly_price"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          ROI / Day
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="ROI_day"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          ROI / overall
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="ROI_overall"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Sponser Bonus
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="Sponser_bonus"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Plan Period
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="plan_period"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          type
                        </label>
                        <select
                          type="number"
                          step="any"
                          name="type"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        >
                          <option value="bot">Bot</option>
                          <option value="investment">Investment</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Reward percentage
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="reward_percent"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>{" "}
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Threeshold
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="threeshold_value"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                  <div className="h-[2px] bg-gray-900 w-full my-8" />
                  <h2 className="text-xl font-semibold mb-5 text-gray-800 mb-2">
                    Active plan Level
                  </h2>
                  <form>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 1
                        </label>
                        <input
                          type="number"
                          name="level_1"
                          step="any"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 2
                        </label>
                        <input
                          type="number"
                          name="level_2"
                          step="any"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 3
                        </label>
                        <input
                          type="number"
                          name="level_3"
                          step="any"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 4
                        </label>
                        <input
                          type="number"
                          name="level_4"
                          step="any"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 5
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_5"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 6
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_6"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 7
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_7"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 8
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_8"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 9
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_9"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 10
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_10"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                        onClick={handleSaveChanges2}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <div className="h-[2px] bg-gray-900 w-full my-8" />
                  <h2 className="text-xl font-semibold mb-5 text-gray-800 mb-2">
                    Invest plan Level
                  </h2>
                  <form>
                    <div className="grid grid-cols-3 gap-4">
                     
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 1
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_1"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 2
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_2"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 3
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_3"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 4
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_4"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 5
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_5"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 6
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_6"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 7
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_7"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 8
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_8"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 9
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_9"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 10
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_10"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 11
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_11"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 12
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_12"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 13
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_13"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 14
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_14"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 15
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_15"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 16
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_16"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 17
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_17"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 18
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_18"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 19
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_19"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700">
                          Level 20
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="level_20"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={handleChange3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                        onClick={handleSaveChanges3}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
