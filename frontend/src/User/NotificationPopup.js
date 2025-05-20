import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { IoNotifications } from "react-icons/io5";
import { getAllNotifications } from "../redux/notificationSlice";
import { useEffect, useState } from "react";

export default function NotificationPopup() {
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch();
  const { notifications } = useSelector( (state) => state.notifications );
  const [latestRow, setLatestRow] = useState(null);
  
  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);


  useEffect(() => {
    if (notifications?.length > 0) {
      const latest = notifications
        .filter(notification => notification.type === "notification")
        .reduce((prev, current) =>
          new Date(prev.created_at) > new Date(current.created_at) ? prev : current,
          {}
        );
  
      setLatestRow(latest && latest.created_at ? latest : null);
    }
  }, [notifications]);
  
  return (
    <>
    {latestRow ? (
      <>
      <Dialog open={open} onClose={()=>{}} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:size-10">
                <IoNotifications aria-hidden="true" className="size-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                {latestRow?.title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-lg text-gray-500">
                   {latestRow?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                data-autofocus
                onClick={()=>setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog></>
    ) : (
      null
    )}
   </>
  )
}
