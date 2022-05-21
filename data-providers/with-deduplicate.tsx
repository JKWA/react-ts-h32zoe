import {
  ArrayProviderOutput,
  Deduplicate,
  DeduplicateArray,
  Type,
} from "./index";

import { uniq } from "fp-ts/Array";

const deduplicateArray: DeduplicateArray<any> = (eq: Deduplicate) => (
  baseOutput: ArrayProviderOutput<any>
) => {
  return {
    ...baseOutput,
    _type: Type.DeduplateArray,
    selectAll: uniq(eq)(baseOutput.selectAll),
  };
};

export default deduplicateArray;
