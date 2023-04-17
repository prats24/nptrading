import React, { useState, useEffect, memo } from "react";

const CountdownTimer = ({ targetDate,text }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  function calculateTimeRemaining() {
    const timeDiff = Date.parse(targetDate) - Date.parse(new Date());
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return {
      total: timeDiff,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const { days, hours, minutes, seconds } = timeRemaining

  if (timeRemaining.total <= 0) {
    return <div>{text}</div>
  }

  return (
    <div>
      {days} days, {hours} hrs, {minutes} mins, {seconds} sec
    </div>
  );
};

export default memo(CountdownTimer);
