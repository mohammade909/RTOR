import {
  addPassport,
  getPassportByid,
  clearErrors,
  clearMessage,
} from "../redux/passportSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import Spinner from "../BaseFile/comman/Spinner";
export default function AddPassportDetail() {
  const dispatch = useDispatch();
  const { singlepassport, loading, error, message } = useSelector(
    (state) => state.passport
  );
  const { auth } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    passport_image: null,
    adhar_image: null,
    passport_num: "",
    adhar_num: "",
  });

  useEffect(() => {
    if (auth?.id) {
      const user_id = auth?.id;
      dispatch(getPassportByid(user_id));
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
  }, [dispatch, error, message, auth?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setData({ ...data, [name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("passport_image", data.passport_image);
    formData.append("adhar_image", data.adhar_image);
    formData.append("passport_num", data.passport_num);
    formData.append("adhar_num", data.adhar_num);
    formData.append("user_id", auth?.id);

    try {
      dispatch(addPassport(formData));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add Passport Details
        </h2>
      </div>
      <div className="max-w-7xl mb-4 mx-auto p-6 bg-white rounded-sm shadow-sm">
        {!singlepassport?.adhar_num && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Passport Image
                </label>
                <input
                  type="file"
                  name="passport_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full border border-gray-300 rounded-sm text-[13px] p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Aadhaar Image
                </label>
                <input
                  type="file"
                  name="adhar_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full border border-gray-300 rounded-sm text-[13px] p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Passport Number
                </label>
                <input
                  type="text"
                  name="passport_num"
                  value={data.passport_num}
                  onChange={handleInputChange}
                  placeholder="Enter Passport Number"
                  className="mt-2 w-full border border-gray-300 rounded-sm text-[13px] p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="adhar_num"
                  value={data.adhar_num}
                  onChange={handleInputChange}
                  placeholder="Enter Aadhaar Number"
                  className="mt-2 w-full border border-gray-300 rounded-sm text-[13px] p-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className=" bg-blue-600 text-white font-medium py-2 px-4 text-[13px] rounded-md hover:bg-blue-700 transition"
              >
                {loading ? <Spinner /> : " Submit"}
              </button>
            </div>
          </form>
        )}

        {singlepassport?.adhar_num && (
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 max-w-7xl mx-auto">
          {/* Passport Section */}
          <div className="flex flex-col items-center border rounded-md shadow-sm overflow-hidden">
            <img
              src={`/uploads/passport/${singlepassport?.passport_image}`}
              alt="Passport"
              className="w-full h-80 object-cover"
            />
            <div className="p-4 text-lg flex w-full gap-4">
              <p className="font-semibold">Passport Number</p>
              <p>{singlepassport?.passport_num}</p>
            </div>
          </div>
        
          {/* Aadhaar Section */}
          <div className="flex flex-col items-center border rounded-md shadow-sm overflow-hidden">
            <img
              src={`/uploads/passport/${singlepassport?.adhar_image}`}
              alt="Aadhaar"
              className="w-full h-80 object-cover"
            />
            <div className="p-4 text-lg flex w-full gap-4">
              <p className="font-semibold">Aadhaar Number</p>
              <p>{singlepassport?.adhar_num}</p>
            </div>
          </div>
          <div className="flex flex-col items-center border rounded-md shadow-sm overflow-hidden">
            <img
              src={`/uploads/passport/${singlepassport?.ticket_image}`}
              alt="Aadhaar"
              className="w-full h-80 object-cover"
            />
            <div className="p-4 text-lg flex justify-between w-full gap-4">
              <div className="flex gap-4">
              <p className="font-semibold">Ticket to :</p>
            <p>{singlepassport?.ticket_two}</p>
            </div>
            <div className="flex gap-4">

              <p className="font-semibold">On date :</p>
              <p>{singlepassport?.ticket_date}</p>
            </div>

            </div>
            
          </div>
        </div>
        
        )}
      </div>
    </>
  );
}
