import { Eq } from 'fp-ts/Eq';
import { TaskEither as TaskEitherType } from 'fp-ts/TaskEither';
import DeduplicateWithSearch from './deduplicate-with-search';
import ArrayWithSearch from './array-with-search';
import ArrayDataProvider from './array-provider';
import DeduplicateDataProvider from './deduplicate-array';

export type Query = { offset?: number; take?: number };

export enum Type {
  Array = 'array',
  DeduplateArray = 'deduplicate_array',
  ArrayWithSearch = 'array_with_search',
  DeduplicateArrayWithSearch = 'deduplicate_array_with_search',
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
) => (data: TaskEither) => (query: Query) => DeduplicateArrayOutput<T>;

export type ArrayWithSearch<T> = (
  searchQuery: Search
) => (data: TaskEither) => (query: Query) => ArrayWithSearchOutput<T>;

export type DeduplicateArrayWithSearch<T> = (
  searchQuery: Search
) => (
  eq: Deduplicate
) => (
  data: TaskEither
) => (query: Query) => DeduplicateArrayWithSearchOutput<T>;

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
    return DeduplicateWithSearch(search)(deduplicate)(task)(query);
  }

  if (search) {
    return ArrayWithSearch(search)(task)(query);
  }

  if (deduplicate) {
    return DeduplicateDataProvider(deduplicate)(task)(query);
  }

  return ArrayDataProvider(task)(query);
}
