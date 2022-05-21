import { ArrayProvider, TaskEither, Query, Type } from './index';
import { useState, useEffect } from 'react';

import { pipe } from 'fp-ts/function';
import { map } from 'fp-ts/Task';
import { fold } from 'fp-ts/Either';

function concatItems(oldItems: any[], newItems: any[]): any[] {
  return oldItems.concat(newItems);
}

// Still thinking about the best way to type this
const arrayProvider: ArrayProvider<any> =
  (data: TaskEither) => (query: Query) => {
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
            (newItems) => setItems(concatItems(allItems, newItems))
          )
        )
      )();
    }, [offset, take]);

    // these is using the OOP idea of methods that return void to update internal state.  Not sure if I like it, but it is a known pattern
    const next = (): void => {
      setErrors([]);
      setCurrentQuery({ take, offset: take + offset });
    };

    return {
      _type: Type.Array,
      errors,
      next,
      selectAll: allItems,
    };
  };

export default arrayProvider;
