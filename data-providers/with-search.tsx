import { ArrayProviderOutput, ArrayWithSearch, Search, Type } from "./index";

import { filter } from "fp-ts/Array";
import { useState } from "react";

const arrayProviderWithSearch: ArrayWithSearch<any> = (searchQuery: Search) => (
  baseOutput: ArrayProviderOutput<any>
) => {
  const [currentSearch, setCurrentSearch] = useState("");

  const search = (search: string): void => {
    setCurrentSearch(search);
  };

  return {
    ...baseOutput,
    _type: Type.ArrayWithSearch,
    search,
    selectAll: baseOutput.selectAll,
    selectFiltered: filter(searchQuery(currentSearch))(baseOutput.selectAll),
  };
};

export default arrayProviderWithSearch;
