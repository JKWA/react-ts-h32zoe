import { ArrayWithSearch, TaskEither, Query, Search, Type } from './index';
import { useState, useEffect } from 'react';

import { filter } from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Task';
import { fold } from 'fp-ts/Either';

function concatItems(oldItems: any[], newItems: any[]): any[] {
  return oldItems.concat(newItems);
}

const arrayProviderWithSearch: ArrayWithSearch<any> =
  (searchQuery: Search) => (data: TaskEither) => (query: Query) => {
    const [allItems, setItems] = useState([]);
    const [errors, setErrors] = useState<Error[]>([]);
    const [currentQuery, setCurrentQuery] = useState(query);
    const [currentSearch, setCurrentSearch] = useState('');
    const { offset = 0, take = 10 } = currentQuery;

    useEffect(() => {
      pipe(
        data({ offset, take }),
        map(
          fold(
            (error) => setErrors([error]),
            (newItems) => setItems(concatItems(allItems, newItems))
          )
        )
      )();
    }, [offset, take]);

    const next = (): void => {
      setErrors([]);
      setCurrentQuery({ take, offset: take + offset });
    };

    const search = (search: string): void => {
      setCurrentSearch(search);
    };

    return {
      _type: Type.ArrayWithSearch,
      errors,
      next,
      search,
      selectAll: allItems,
      selectFiltered: filter(searchQuery(currentSearch))(allItems),
    };
  };

export default arrayProviderWithSearch;
