import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const expireAt = useSelector((state) => state.auth.expireAt);
  const adminExpireAt = useSelector((state) => state.auth.adminExpireAt);

  useEffect(() => {
    if (!expireAt && !adminExpireAt) return;

    const currentTime = Date.now();
    const times = [expireAt, adminExpireAt].filter(Boolean); // Only keep valid timestamps
    const earliestExpire = Math.min(...times);

    const timeLeft = earliestExpire - currentTime;

    if (timeLeft <= 0) {
      localStorage.clear();
      window.location.href = '/';
    } else {
      const timeout = setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, timeLeft);

      return () => clearTimeout(timeout);
    }
  }, [expireAt, adminExpireAt, dispatch]);
};

export default useAutoLogout;
