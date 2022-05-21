import * as React from 'react';
import { useRef } from 'react';
import { sort } from 'fp-ts/lib/Array';
import { Ord } from 'fp-ts/Ord';
import {
  ArrayWithSearchOutput,
  DeduplicateArrayWithSearchOutput,
} from '../../data-providers';
import ShowErrors from '../ShowErrors';

type Props<T> = {
  title: string;
  dataProvider: ArrayWithSearchOutput<T> | DeduplicateArrayWithSearchOutput<T>;
  ord: Ord<T>;
  template: any;
};

const ListWithSearch = <T, K>(props: Props<T>) => {
  const { title, dataProvider, ord, template } = props;
  const ref = useRef<HTMLInputElement>(null);
  const { search, next, selectAll, selectFiltered, errors } = dataProvider;

  function handleSearch() {
    if (ref.current) {
      search(ref.current.value);
    }
  }

  return (
    <div>
      <h2>{title}</h2>
      {errors.length > 0 && <ShowErrors errors={errors} />}
      <input ref={ref} onInput={handleSearch} />
      <div>
        {selectFiltered.length} of {selectAll.length}
      </div>
      <ol>
        {sort(ord)(selectFiltered).map((item, index) => (
          <li key={index}>{template(item)}</li>
        ))}
      </ol>
      <button onClick={next}>Add Items</button>
    </div>
  );
};

export default ListWithSearch;
