import * as React from 'react';
import { sort } from 'fp-ts/lib/Array';
import { Ord } from 'fp-ts/Ord';
import { ArrayProviderOutput } from '../../data-providers';
import ShowErrors from '../ShowErrors';

type Props<T> = {
  title: string;
  dataProvider: ArrayProviderOutput<T>;
  ord: Ord<T>;
  template: any;
};

const ListWithSearch = <T, K>(props: Props<T>) => {
  const { title, dataProvider, ord, template } = props;
  const { next, selectAll, errors } = dataProvider;
  return (
    <div>
      <h2>{title}</h2>
      {errors.length > 0 && <ShowErrors errors={errors} />}
      <div>{selectAll.length} items</div>
      <ol>
        {sort(ord)(selectAll).map((item, index) => (
          <li key={index}>{template(item)}</li>
        ))}
      </ol>
      <button onClick={next}>Add Items</button>
    </div>
  );
};

export default ListWithSearch;
