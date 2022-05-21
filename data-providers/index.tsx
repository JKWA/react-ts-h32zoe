import ArrayDataProvider from "./array-data-provider";
import { Eq } from "fp-ts/Eq";
import { TaskEither as TaskEitherType } from "fp-ts/TaskEither";
import WithDeduplicate from "./with-deduplicate";
import WithDeduplicateAndSearch from "./with-deduplicate-and-search";
import WithSearch from "./with-search";
import { pipe } from "fp-ts/lib/function";

export type Query = { offset?: number; take?: number };

export enum Type {
  Array = "array",
  DeduplateArray = "deduplicate_array",
  ArrayWithSearch = "array_with_search",
  DeduplicateArrayWithSearch = "deduplicate_array_with_search",
}

export type Search = (search: string) => (item: any) => boolean;

export type TaskEither = (query: Query) => TaskEitherType<Error, any[]>;

export type Deduplicate = Eq<unknown>;

type BaseOutput<T> = {
  _type: Type;
  errors: Error[];
  next: () => void;
  selectAll: T[];
};

type SearchOutput<T> = {
  search: (search: string) => void;
  selectFiltered: T[];
};

export type ArrayProviderOutput<T> = BaseOutput<T> & {
  _type: Type.Array;
};

export type DeduplicateArrayOutput<T> = BaseOutput<T> & {
  _type: Type.DeduplateArray;
};

export type ArrayWithSearchOutput<T> = BaseOutput<T> &
  SearchOutput<T> & {
    _type: Type.ArrayWithSearch;
  };

export type DeduplicateArrayWithSearchOutput<T> = BaseOutput<T> &
  SearchOutput<T> & {
    _type: Type.DeduplicateArrayWithSearch;
  };

export type ArrayProvider<T> = (
  data: TaskEither
) => (query: Query) => ArrayProviderOutput<T>;

export type DeduplicateArray<T> = (
  eq: Deduplicate
) => (baseOutput: ArrayProviderOutput<T>) => DeduplicateArrayOutput<T>;

export type ArrayWithSearch<T> = (
  searchQuery: Search
) => (baseOutput: ArrayProviderOutput<T>) => ArrayWithSearchOutput<T>;

export type DeduplicateArrayWithSearch<T> = (
  searchQuery: Search
) => (
  baseOutput: DeduplicateArrayOutput<T>
) => DeduplicateArrayWithSearchOutput<T>;

export type Output<T> =
  | ArrayProviderOutput<T>
  | DeduplicateArrayOutput<T>
  | ArrayWithSearchOutput<T>
  | DeduplicateArrayWithSearchOutput<T>;

export function create<T>(
  task: TaskEither,
  options?: {
    search?: Search;
    query?: Query;
    deduplicate?: Deduplicate;
  }
): Output<T> {
  const { query = {}, search, deduplicate } = options;

  if (search && deduplicate) {
    return pipe(
      ArrayDataProvider(task)(query),
      WithDeduplicate(deduplicate),
      WithDeduplicateAndSearch(search)
    );

    // return WithDeduplicateAndSearch(search)(deduplicate)(task)(query);
  }

  if (search) {
    return pipe(ArrayDataProvider(task)(query), WithSearch(search));
  }

  if (deduplicate) {
    return pipe(ArrayDataProvider(task)(query), WithDeduplicate(deduplicate));
  }

  return ArrayDataProvider(task)(query);
}
