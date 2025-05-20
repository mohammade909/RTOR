import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useQRCode } from "react-qrcode";
import { FaCopy } from "react-icons/fa";
import Spinner from "../BaseFile/comman/Spinner";
export default function Scanner({ openModel, link, text, isClose }) {
  let dataUrl1 = useQRCode(link);
  return (
    <Dialog open={openModel} onClose={isClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-black border px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="px-2">
                <div className=" flex justify-between items-center mb-3">
                  <h2 className="text-base font-semibold mb-5 text-gray-300 mb-2">
                    {text} Scanner
                  </h2>
                  <button onClick={isClose}>
                    <div class="group flex  cursor-pointer items-center justify-center mb-2 ">
                      <div class="space-y-2">
                        <span class="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
                        <span class="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="">
                  <div className="w-full">
                    <>
                      <div className="items-center flex justify-center">
                        {dataUrl1 && (
                          <img
                            className="w-48 h-48 object-cover"
                            src={dataUrl1 ? dataUrl1 : ""}
                            alt="QR Code"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-white border mt-5 py-1 px-2 rounded-lg">
                        <h1 className="max-w-xs truncate overflow-hidden">
                          {link}
                        </h1>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link || "");
                            alert("Copied to clipboard!"); 
                          }}
                          className="focus:outline-none text-white"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
