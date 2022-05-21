import * as React from 'react';
import { useRef } from 'react';
import { sort } from 'fp-ts/lib/Array';
import { useArrayWithSearchDataProvider } from '../../data-providers/hooks';
import * as Data from '../../data';
import ShowErrors from '../ShowErrors';

type Props = {
  title: string;
};

const ListWithSearchUsingHook = (props: Props) => {
  const { title } = props;
  const dataProvider = useArrayWithSearchDataProvider(Data.searchAll)(
    Data.getCars
  )({ offset: 0, take: 5 });

  const { search, next, selectAll, selectFiltered, errors } = dataProvider;

  const ref = useRef<HTMLInputElement>(null);

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
        {sort(Data.ordByYear)(selectFiltered).map((item, index) => (
          <li key={index}>
            <span>
              {item.year} {item.make} {item.model}
            </span>
          </li>
        ))}
      </ol>
      <button onClick={next}>Add Items</button>
    </div>
  );
};

export default ListWithSearchUsingHook;