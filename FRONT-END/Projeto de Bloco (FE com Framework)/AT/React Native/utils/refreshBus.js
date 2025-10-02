
import { EventEmitter } from "events";
import { useEffect } from "react";

export const RefreshBus = new EventEmitter();

/** Dispara um refresh global */
export function pushRefresh(payload) {
  // payload é opcional; 
  RefreshBus.emit("refresh", payload ?? Date.now());
}

/** Hook para reagir ao refresh global */
export function useRefreshListener(callback) {
  useEffect(() => {
    const handler = (data) => { try { callback?.(data); } catch (_) {} };
    RefreshBus.on("refresh", handler);
    return () => RefreshBus.off("refresh", handler);
  }, [callback]);
}
