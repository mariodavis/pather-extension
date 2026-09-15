import { useCallback, useEffect, useState } from "react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";

export function useDriveAuth() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await messageBus.send({ type: MESSAGE_TYPES.AUTH_STATUS });
    setConnected(res.ok ? res.data.connected : false);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const connect = useCallback(async () => {
    setLoading(true);
    await messageBus.send({ type: MESSAGE_TYPES.AUTH_CONNECT });
    await refresh();
  }, [refresh]);

  const disconnect = useCallback(async () => {
    setLoading(true);
    await messageBus.send({ type: MESSAGE_TYPES.AUTH_DISCONNECT });
    await refresh();
  }, [refresh]);

  return { connected, loading, connect, disconnect };
}
