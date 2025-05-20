import { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { AiFillDelete } from "react-icons/ai";
export function Confirmation({ isClose,deletefunction,id }) {
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch()
  const handleDelete =()=>{
      dispatch(deletefunction(id))
      isClose()
  }
  return (
    <Dialog open={open} onClose={isClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center p-4 mt-48 text-center lg:min-h-full lg:mt-0 sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-gray-900 bg-gradient-to-bl from-red-300 via-fuchsia-300 to-pink-300 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                <AiFillDelete aria-hidden="true" className="w-6 h-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 ">
                  Confirm
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-lg ">
                  Are you sure you want to delete this item?
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5 sm:mt-6">
            <button
                type="button"
                onClick={isClose}
                className="inline-flex justify-center w-full px-3 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex justify-center w-full px-3 py-2 text-lg font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Delete
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
