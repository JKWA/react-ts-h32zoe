import * as React from 'react';
import { sort } from 'fp-ts/lib/Array';
import { Ord } from 'fp-ts/Ord';
import { DeduplicateArrayOutput } from '../../data-providers';
import ShowErrors from '../ShowErrors';
import WorkingMessage from '../WorkingMessage';

type Props<T> = {
  title: string;
  dataProvider: DeduplicateArrayOutput<T>;
  ord: Ord<any>;
  template: any;
};

const DeduplicatedList = <T,> (props: Props<T>) => {
  const { title, dataProvider, ord, template } = props;
  const { next, selectAll, errors, working } = dataProvider;

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
      <WorkingMessage show={working} message={"Working..."}/>
    </div>
  );
};

export default DeduplicatedList;
