import {
  DeduplicateArrayOutput,
  DeduplicateArrayWithSearch,
  Search,
  Type,
} from "./index";

import { filter } from "fp-ts/Array";
import { useState } from "react";

const deduplicateArrayWithSearch: DeduplicateArrayWithSearch<any> = (
  searchQuery: Search
) => (baseOutput: DeduplicateArrayOutput<any>) => {
  const [currentSearch, setCurrentSearch] = useState("");

  const search = (search: string): void => {
    setCurrentSearch(search);
  };

  return {
    ...baseOutput,
    _type: Type.DeduplicateArrayWithSearch,
    search,
    selectAll: baseOutput.selectAll,
    selectFiltered: filter(searchQuery(currentSearch))(baseOutput.selectAll),
  };
};

export default deduplicateArrayWithSearch;
