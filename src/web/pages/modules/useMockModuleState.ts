import { useEffect, useState } from "react";
import { UiDataState } from "@/web/types";

const useMockModuleState = (latencyMs = 350) => {
  const [state, setState] = useState<UiDataState>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState("ready");
    }, latencyMs);
    return () => window.clearTimeout(timer);
  }, [latencyMs]);

  return { state, setState };
};

export default useMockModuleState;