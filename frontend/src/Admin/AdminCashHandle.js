import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../BaseFile/comman/Spinner";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  debitAmount,
  clearErrors,
  clearMessage,
} from "../redux/withdrawalSlice";

export default function AdminCashHandle({
  HandleCashmodel,
  cashHandle,
  name,
  userId,
  balance,
  roi,
  profitWallet,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [values, setValues] = useState({});
  const [wallet_type, setWallet_type] = useState("active");
  const [maxamount, setMaxamount] = useState();

  const { loading } = useSelector((state) => state.allwithdrawal);

  useEffect(() => {
    if (wallet_type == "business") {
      setMaxamount(balance);
    } else if (wallet_type === "profit") {
      setMaxamount(profitWallet);
    } else {
      setMaxamount(roi);
    }
  }, [wallet_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
      id: userId,
      action: cashHandle,
    }));
  };

  const handleSaveChanges = (e) => {
    if (!wallet_type) {
      return alert("select wallet type");
    }
    if (values.amount > maxamount && cashHandle == "debit") {
      return alert("Amount exceed limit");
    }
    if (values.amount <= 30 && cashHandle == "debit") {
      return alert("Amount should be greater than 30");
    }
    const updatedData = { ...values, wallet_type: wallet_type };
    dispatch(debitAmount({ updatedData: updatedData }));
    HandleCashmodel();
  };

  return (
    <>
      <Dialog open={open} onClose={HandleCashmodel} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-auto md:min-h-screen mt-20 md:mt-0 items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl capitalize">
                  {cashHandle} From {name}
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-200">
                  Credit or Debit amount from user (current balance :{" "}
                  {wallet_type == "active" ? balance : roi})
                </p>
              </div>
              <form
                action="#"
                method="POST"
                className="mx-auto mt-4 max-w-xl sm:mt-4"
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 ">
                  {cashHandle === "debit" && (
                    <div>
                      <label
                        htmlFor="wallet_type"
                        className="block text-lg font-semibold leading-6 text-gray-300"
                      >
                        Wallet
                      </label>
                      <div className="mt-2.5">
                        <select
                          id="wallet_type"
                          name="wallet_type"
                          onChange={(e) => setWallet_type(e.target.value)}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-300 bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                        >
                          <option value="profit">Profit</option>
                          <option value="business">Active</option>
                          <option value="working">Trade wallet</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-lg font-semibold leading-6 text-gray-300"
                    >
                      Amount
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        onChange={handleChange}
                        defaultValue={maxamount}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-300 bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      onClick={handleSaveChanges}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={HandleCashmodel}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      {loading ? <Spinner /> : "Cancel"}
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
