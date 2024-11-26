/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

const usePreventRefresh = (shouldWarn: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (!shouldWarn) return;
      const message =
        "Are you sure you want to leave? process upload will be lost.";
      e.preventDefault();
      e.returnValue = message; // For most browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
};

export default usePreventRefresh;
