import { useCallback, useEffect, useState } from "react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";
import { createEmptyProgress } from "@shared/driveNode";

export function useScanProgress() {
  const [progress, setProgress] = useState(createEmptyProgress());

  useEffect(() => {
    messageBus.send({ type: MESSAGE_TYPES.SCAN_PROGRESS_GET }).then((res) => {
      if (res.ok) setProgress(res.data);
    });
    return messageBus.onProgress(setProgress);
  }, []);

  const start = useCallback(async () => {
    await messageBus.send({ type: MESSAGE_TYPES.SCAN_START });
  }, []);

  const stop = useCallback(async () => {
    await messageBus.send({ type: MESSAGE_TYPES.SCAN_STOP });
  }, []);

  return { progress, start, stop };
}
