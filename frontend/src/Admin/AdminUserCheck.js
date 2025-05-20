import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader"
import SuccessAlert from "../BaseFile/comman/SuccessAlert"
import ErrorAlert from "../BaseFile/comman/ErrorAlert"
import { getUser, updateUsers,clearErrors, clearMessage } from "../redux/userSlice";
export default function AdminUserCheck() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleuser, loading, error, message } = useSelector(
    (state) => state.allusers
  );
  const [editUser, setEditUser] = useState([]);

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
      }
    )
    );
  };
  return (
    <>
      <div
        className={`${
          loading ? "h-[560px] items-center" : "h-full"
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="my-4 ">
              <div className="max-w-7xl bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300 text-white overflow-hidden">
                <div className="px-6 py-4">
                {message && <SuccessAlert message={message} />}
                {error && <ErrorAlert error={error} />}
                  <h2 className="text-xl capitalize font-semibold  mb-4">
                    {singleuser?.username} Detail
                  </h2>
                  <div className="lg:flex lg:space-x-4">
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Last Login
                      </div>
                      <div className="text-white">
                        {singleuser?.last_login || " - "}
                      </div>
                    </div>
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Created At
                      </div>
                      <div className="text-white">
                        {singleuser?.created_at || " - "}
                      </div>
                    </div>
                  </div>
                  <div className="lg:flex lg:space-x-4 mt-2">
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">Verify At</div>
                      <div className="text-white">
                        {singleuser?.verify_at || " - "}
                      </div>
                    </div>
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Updated At
                      </div>
                      <div className="text-white">
                        {singleuser?.updated_at || " - "}
                      </div>
                    </div>
                  </div>
                  <div className="lg:flex lg:space-x-4 mt-2">
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">Reffer By</div>
                      <div className="text-white">
                        {singleuser?.reffer_by || " - "}
                      </div>
                    </div>
                  </div>
                  <div className="lg:flex lg:space-x-4 mt-2">

                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Activation Date
                      </div>
                      <div className="text-white">
                        {singleuser?.activation_date || " - "}
                      </div>
                    </div>
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Paid Member
                      </div>
                      <div className="text-white">
                        {singleuser?.paid_member || " - "}
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex lg:space-x-4 mt-2">
                  <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        level_month / month
                      </div>
                      <div className="text-white">
                        {singleuser?.level_month || " - "}
                      </div>
                    </div> 
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        ROI/day
                      </div>
                      <div className="text-white">
                        {singleuser?.roi_day || " - "}
                      </div>
                    </div>
                    </div>


                  <div className="lg:flex lg:space-x-4 mt-2">
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Refferal Code
                      </div>
                      <div className="text-white">
                        {singleuser?.refferal_code || " - "}
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        Total Team
                      </div>
                      <div className="text-white">
                        {singleuser?.total_team || " - "}
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex lg:space-x-4 mt-2">
                    

                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        BEP20 Address
                      </div>
                      <div className="text-white">
                        {singleuser?.bep20 || " - "}
                      </div>
                    </div>

                    <div className="lg:w-1/2 flex gap-8">
                      <div className="font-medium text-white">
                        TRC20 Address
                      </div>
                      <div className="text-white">
                        {singleuser?.trc20 || " - "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[2px] bg-green-600 w-full " />
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 border-b border-blue-500 text-gray-300 mb-4">
              <div className="max-w-7xl mx-auto rounded shadow overflow-hidden">
              {message && <SuccessAlert message={message} />}
              {error && <ErrorAlert error={error} />}
                <div className="px-6 py-4">
                  <h2 className="text-xl font-semibold mb-5 text-white ">
                    Editable Details
                  </h2>
                  <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Role
                      </label>
                      <select
                        name="role"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.role}
                        onChange={handleChange}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Status
                      </label>
                      <select
                        name="status"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.status}
                        onChange={handleChange}
                      >
                        <option value="unblock">unblock</option>
                        <option value="block">Block</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Is Active
                      </label>
                      <select
                        name="is_active"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.is_active}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Roi Status
                      </label>
                      <select
                        name="roi_status"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.roi_status}
                        onChange={handleChange}
                      >
                        <option value="open">Open</option>
                        <option value="close">Close</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        level status
                      </label>
                      <select
                        name="level_status"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.level_status}
                        onChange={handleChange}
                      >
                        <option value="open">Open</option>
                        <option value="close">Close</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.address || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Business
                      </label>
                      <input
                        type="number"
                        name="business"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.business || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Business Balance
                      </label>
                      <input
                        type="number"
                        name="business_balance"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.business_balance || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.fullname || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Phone
                      </label>
                      <input
                        type="number"
                        name="phone"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.phone || ""}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Forming ROI Status
                      </label>
                      <input
                        type="number"
                        name="forming_roi_status"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.forming_roi_status || ""}
                        onChange={handleChange}
                      />
                    </div> */}
                    {/* <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        level_month Status
                      </label>
                      <input
                        type="number"
                        name="level_month_status"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.level_month_status || ""}
                        onChange={handleChange}
                      />
                    </div> */}
                    {/* <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Zero Pin
                      </label>
                      <input
                        type="number"
                        name="zero_pin"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.zero_pin}
                        onChange={handleChange}
                      />
                    </div> */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white">
                        Refferal By
                      </label>
                      <input
                        type="text"
                        name="reffer_by"
                        className="mt-1 block w-full p-2 text-white bg-blue-800/50  border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        defaultValue={singleuser?.reffer_by}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 bg-indigo-600  text-white rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-600"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
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