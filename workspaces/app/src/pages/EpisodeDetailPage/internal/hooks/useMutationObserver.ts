// NOTE: https://www.30secondsofcode.org/react/s/use-mutation-observer/
import { useEffect } from "react";

export const useMutationObserver = (
  ref: React.RefObject<Element>,
  callback: () => void,
  options: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    const observer = new MutationObserver(callback);
    if (ref.current) {
      observer.observe(ref.current, options);
    }
    return () => {
      observer.disconnect();
    }
  }, [callback, options, ref]);
};
