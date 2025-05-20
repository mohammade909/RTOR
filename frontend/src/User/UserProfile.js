import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import {
  getUser,
  updateUsers,
  clearErrors,
  clearMessage,
} from "../redux/userSlice";
export default function UserProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleuser, loading, error, message } = useSelector(
    (state) => state.allusers
  );
  const [editUser, setEditUser] = useState([]);
  const [revel, setRevel] = useState(false);

  useEffect(() => {
    dispatch(getUser(id));
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
  }, [dispatch, error, message, clearErrors, clearMessage, id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    const updatedData = {
      ...editUser,
      updated_at: new Date().toISOString(),
    };
    dispatch(
      updateUsers({
        id: id,
        updatedData: updatedData,
      })
    );
  };

  function handleRevelPin() {
    setRevel(!revel);
  }

  return (
    <>
      <div
        className={`${loading ? "h-[560px] items-center" : "h-full"} h-screen`}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {message && <SuccessAlert message={message} />}
            {error && <ErrorAlert error={error} />}
            {/* <div className=" relative z-10  max-w-7xl mx-auto">
              <div className="max-w-full text-white bg-[#111c54c7] rounded shadow overflow-hidden">
                <div className="grid grid-cols-2 gap-6 px-6 py-4">
                  <div className="w-full p-4 rounded-sm text-gray-100 bg-[#569182c7]">
                    <div className="flex flex-col w-full gap-2 mt-4">
                      <label className="font-medium =">
                        Bep 20
                      </label>
                      <input
                        name="bep20"
                        onChange={handleChange}
                        defaultValue={singleuser?.bep20}
                        className="w-full p-2 px-2 py-3 text-lg text-gray-100 bg-[#7e66c5b3] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Bep 20 value"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-2 mt-4">
                      <label className="font-medium ">
                        Email
                      </label>
                      <input
                        name="email"
                        onChange={handleChange}
                        defaultValue={singleuser?.email}
                        className="w-full p-2 px-2 py-3 text-lg text-gray-100 bg-[#7e66c5b3] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Bep 20 value"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-2 mt-4">
                      <label className="font-medium ">
                        Phone
                      </label>
                      <input
                        name="phone"
                        onChange={handleChange}
                        defaultValue={singleuser?.phone}
                        className="w-full p-2 px-2 py-3 text-lg text-gray-100 bg-[#7e66c5b3] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Bep 20 value"
                      />
                    </div>
                     <div className="flex justify-start w-full mt-6 ">
                      <button
                        onClick={handleSaveChanges}
                        className="w-full px-6 py-2 text-lg font-semibold text-gray-100 bg-[#4b1725ab] transition duration-200 rounded  sm:w-auto hover:bg-[#291017ab]"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-4 text-xl font-semibold capitalize">
                      {singleuser?.username} Detail
                    </h2>
                    <div className="">
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 ">
                        <div className="font-medium border-b border-green-800">
                          Last Login
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.last_login || " - "}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 ">
                        <div className="font-medium border-b border-green-800">
                          Created At
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.created_at || " - "}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                        <div className="font-medium border-b border-green-800">
                          Reffer By
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.reffer_by || " - "}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                        <div className="font-medium border-b border-green-800">
                          Activation Date
                        </div>
                        <div className="border-b border-green-800 t">
                          {singleuser?.activation_date || " - "}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                        <div className="font-medium border-b border-green-800">
                          Updated Date
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.updated_at || " - "}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                        <div className="font-medium border-b border-green-800">
                          Refferal Code
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.active_plan !== 0
                            ? "referral code not active "
                            : singleuser?.refferal_code}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
                        <div className="font-medium border-b border-green-800">
                          Total Team
                        </div>
                        <div className="border-b border-green-800 ">
                          {singleuser?.total_team || " - "}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="relative z-10 max-w-7xl mx-auto ">
              <div className="bg-[#1e2a3a] text-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column - Form Section */}
                  <div className="bg-[#2a3b4c] p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">
                      Update Details
                    </h3>

                    <div className="space-y-4">
                      {/* Bep 20 Input */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                          Setup your M-Pin
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="mpin"
                            type={revel ? "text" : "password"}
                            maxLength={6}
                            minLength={6}
                            onChange={handleChange}
                            defaultValue={singleuser?.mpin}
                            className="w-full px-4 py-3 bg-[#4b5c6c] text-gray-100 rounded-md border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter 6-digit M-Pin"
                          />
                          <button
                            type="button"
                            onClick={handleRevelPin}
                            className="absolute right-2 px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all duration-200"
                          >
                            {revel ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium mb-1">Bep 20</label>
                        <input
                          name="bep20"
                          onChange={handleChange}
                          defaultValue={singleuser?.bep20}
                          className="w-full p-3 bg-[#4b5c6c] text-gray-100 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter Bep 20 value"
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                          name="email"
                          onChange={handleChange}
                          defaultValue={singleuser?.email}
                          className="w-full p-3 bg-[#4b5c6c] text-gray-100 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter Email"
                        />
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label className="block font-medium mb-1">Phone</label>
                        <input
                          name="phone"
                          onChange={handleChange}
                          defaultValue={singleuser?.phone}
                          className="w-full p-3 bg-[#4b5c6c] text-gray-100 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter Phone Number"
                        />
                      </div>

                      {/* Update Button */}
                      <button
                        onClick={handleSaveChanges}
                        className="w-full bg-[#4b1725] text-lg font-semibold py-3 rounded-md hover:bg-[#291017] transition duration-300"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Right Column - User Details */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {singleuser?.username} Details
                    </h3>

                    <div className="bg-[#2a3b4c] p-6 rounded-lg shadow-md space-y-4">
                      {/* User Details Grid */}
                      {[
                        { label: "Last Login", value: singleuser?.last_login },
                        { label: "Created At", value: singleuser?.created_at },
                        { label: "Referred By", value: singleuser?.reffer_by },
                        {
                          label: "Activation Date",
                          value: singleuser?.activation_date,
                        },
                        {
                          label: "Updated Date",
                          value: singleuser?.updated_at,
                        },

                        {
                          label: "Referral Code",
                          value:
                            singleuser?.active_plan == 0
                              ? "Referral code not active"
                              : singleuser?.refferal_code,
                        },
                        { label: "Total Team", value: singleuser?.total_team },
                      ].map(({ label, value }, index) => (
                        <div
                          key={index}
                          className="flex justify-between border-b border-gray-500 pb-2"
                        >
                          <span className="font-medium text-gray-300">
                            {label}
                          </span>
                          <span className="text-gray-200">{value || "-"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
