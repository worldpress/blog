import { useEffect } from "react";

type CallbackFunc = (event: Event) => void;

const useSrcoll = (callback: CallbackFunc) => {
  useEffect(() => {
    const scrollListener: EventListener = event => callback(event);
    document.addEventListener('scroll', scrollListener);
    return () => {
      document.removeEventListener('scroll', scrollListener)
    };
  });
};

export default useSrcoll;