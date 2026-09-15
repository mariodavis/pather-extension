import { useCallback, useState } from "react";
import { messageBus } from "@services/messaging/MessageBus";
import { MESSAGE_TYPES } from "@services/messaging/messageTypes";

export function useSearch() {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (term, filters) => {
    setSearching(true);
    const res = await messageBus.send({ type: MESSAGE_TYPES.SEARCH_RUN, query: { term, filters } });
    setResults(res.ok ? res.data : []);
    setSearching(false);
    setHasSearched(true);
  }, []);

  return { results, search, searching, hasSearched };
}
