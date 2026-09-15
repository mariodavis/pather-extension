import { useCallback, useEffect, useState } from "react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";

export function useDriveChildren() {
  const [childrenByParent, setChildrenByParent] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const loadChildren = useCallback(async (parentId) => {
    setLoadingId(parentId);
    const res = await messageBus.send({ type: MESSAGE_TYPES.TREE_CHILDREN_GET, parentId });
    if (res.ok) {
      setChildrenByParent((prev) => ({ ...prev, [parentId]: res.data }));
    }
    setLoadingId(null);
  }, []);

  return { childrenByParent, loadChildren, loadingId };
}

export function useDriveCounts() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    messageBus.send({ type: MESSAGE_TYPES.TREE_COUNTS_GET }).then((res) => {
      if (res.ok) setCounts(res.data);
    });
  }, []);

  return counts;
}
