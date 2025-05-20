import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startDate, endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Ensure dates are properly parsed
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      
      const difference = end - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    // Initial call
    calculateTimeLeft();

    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [endDate]);

  // Pad single digit numbers with leading zero
  const pad = (num) => num.toString().padStart(2, '0');

  return (
    <div className="grid grid-cols-4 gap-2 text-white  p-2.5 ">
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-300">{pad(timeLeft.days)}</div>
        <div className="text-xs">Days</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-300">{pad(timeLeft.hours)}</div>
        <div className="text-xs">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-300">{pad(timeLeft.minutes)}</div>
        <div className="text-xs">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-300">{pad(timeLeft.seconds)}</div>
        <div className="text-xs">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;