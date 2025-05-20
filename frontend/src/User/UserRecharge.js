import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
// import { addRecharge } from "../redux/topupSlice";
import { QRCode } from "react-qrcode";
import { useQRCode } from "react-qrcode";
import QrModal from "./QrModal";
const UserRecharge = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.alltopup);
  const [file, setFile] = useState(null);
  const [fieldError, setFiledError] = useState(null);
  const [amount, setAmount] = useState("");
  const [value, setValue] = useState("");
  const [qrLink, setQrLink] = useState("");
  const dataUrl = useQRCode(value);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();
    formData.append("image", file);
    formData.append("amount", amount);
    formData.append("userby_id", auth?.id);

    // dispatch(addRecharge(formData));
  };

  function handleQr(){
    setValue(qrLink)
  }
  return (
    <>
      <div className="flex justify-between">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full justify-gap-around gap-8">
            <div className="mb-4 w-1/4">
              <label className="block text-lg font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="type user amount . . ."
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="mb-4 w-1/8">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                File
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  name="image"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => document.getElementById("file").click()}
                >
                  Choose File
                </button>
              </div>
            </div>
            <div className=" flex justify-center items-center pb-4">
              <button
                type="submit"
                className="px-4 py-2 mt-7  bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              >
                {loading ? <Spinner /> : "Recharge"}
              </button>
            </div>
          </div>
        </form>
        {fieldError && <div className="text-red-500"> {fieldError} </div>}

        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700">
            QR-Code Link
          </label>
          <div className="flex gap-4">
            <input
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(e) => setQrLink(e.currentTarget.value)}
            />
            <button onClick={handleQr} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              {" "}
              Generate QrCode
            </button>
          </div>
        </div>
      </div>
      {value && <QrModal dataUrl={dataUrl} setValue={setValue}/>}
    </>
  );
};

export default UserRecharge;
