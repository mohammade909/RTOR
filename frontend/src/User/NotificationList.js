import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNotifications } from '../redux/notificationSlice'; // Adjust path as necessary
import { FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

const NotificationList = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
   // Replace with dynamic value
    dispatch(getUserNotifications(auth?.id));
  }, [dispatch]);

  const getAlertStyle = (type) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-[#07154510]',
          border: 'border-[#063c96]',
          text: 'text-[#0396ff]',
          icon: <FaInfoCircle className="start-icon mr-2 text-[#0bd2ff] animate-bounce" />,
        };
      case 'warning':
        return {
          bg: 'bg-[#07154510]',
          border: 'border-[#f18e06]',
          text: 'text-[#ffb103]',
          icon: <FaExclamationTriangle className="start-icon mr-2 text-[#ffb103] animate-bounce" />,
        };
      case 'danger':
        return {
          bg: 'bg-[#07154510]',
          border: 'border-[#f10606]',
          text: 'text-[#ff0303]',
          icon: <FaTimesCircle className="start-icon mr-2 text-[#ff0303] animate-bounce" />,
        };
      default:
        return {
          bg: 'bg-[#07154510]',
          border: 'border-gray-400',
          text: 'text-gray-400',
          icon: <FaInfoCircle className="mr-2 text-gray-400 start-icon" />,
        };
    }
  };

  if (loading) return <div className='text-gray-800'>Loading notifications...</div>;

  return (
    <section className="relative ">
      {/* <div className="absolute rotate-45 opacity-30 left-[-80px] top-[-60px] w-[300px] h-[300px] rounded-[45px] bg-gradient-to-r from-[#290a59] to-[#3d57f4]"></div>
      <div className="absolute rotate-45 opacity-30 left-[150px] top-[-25px] w-[400px] h-[450px] rounded-[45px] bg-gradient-to-r from-[#290a59] to-[#3d57f4]"></div> */}

      <div className="container h-screen mx-auto">
        <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications?.filter((item)=>item.type=="notification")?.map((notification) => {
            const { id, title, message, type } = notification;
            const { bg, border, text, icon } = getAlertStyle(type);

            return (
              <div
                key={id}
                className={`alert fade alert-simple border ${bg} ${border} ${text} shadow-md transition duration-500 cursor-pointer hover:bg-opacity-70 rounded-sm flex items-center justify-between p-4`}
              >
                <div className="flex items-center">
                  {icon}
                  <div>
                    <strong className="font-semibold">{title}</strong>: {message}
                  </div>
                </div>
                <button type="button" className="text-2xl hover:animate-bounce">
                  <AiOutlineClose />
                </button>
              </div>
            );
          })
        ) : (
          <div className="py-2 text-lg text-center border border-gray-300 text-gray-900  rounded-sm shadow-sm bg-[#fefefe85]">No notifications available</div>
        )}
        </div>
      </div>
    </section>
  );
};

export default NotificationList;
