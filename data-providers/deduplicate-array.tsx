import {
  Deduplicate,
  TaskEither,
  Query,
  DeduplicateArray,
  Type,
} from './index';
import { useState, useEffect } from 'react';

import { uniq } from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Task';
import { fold } from 'fp-ts/Either';

function concatItems(oldItems: any[], newItems: any[]): any[] {
  return oldItems.concat(newItems);
}

const deduplicateArray: DeduplicateArray<any> =
  (eq: Deduplicate) => (data: TaskEither) => (query: Query) => {
    const [allItems, setItems] = useState([]);
    const [errors, setErrors] = useState<Error[]>([]);
    const [currentQuery, setCurrentQuery] = useState(query);
    const { offset = 0, take = 10 } = currentQuery;

    useEffect(() => {
      pipe(
        data({ offset, take }),
        map(
          fold(
            (error) => setErrors([error]),
            (newItems) => setItems(uniq(eq)(concatItems(allItems, newItems)))
          )
        )
      )();
    }, [offset, take]);

    const next = (): void => {
      setErrors([]);
      setCurrentQuery({ take, offset: take + offset });
    };

    return {
      _type: Type.DeduplateArray,
      errors,
      next,
      selectAll: allItems,
    };
  };

export default deduplicateArray;
