import * as React from 'react';
import { Ord } from 'fp-ts/Ord';
import { Output, Type } from '../../data-providers';
import ListWithSearch from './ListWithSearch';
import BaseList from './BaseList';
import { absurd } from 'fp-ts/lib/function';

type Props<T> = {
  title: string;
  dataProvider: Output<T>;
  ord: Ord<any>;
  template: any;
};

// Auto format will not take an empty , that's why the K
const ListWithAnyDataProvider = <T, K>(props: Props<T>): JSX.Element => {
  const { dataProvider } = props;

  switch (dataProvider._type) {
    case Type.Array: {
      return <BaseList<T> {...(props as any)} />;
    }
    case Type.DeduplateArray: {
      return <BaseList<T> {...(props as any)} />;
    }
    case Type.ArrayWithSearch: {
      return <ListWithSearch<T> {...(props as any)} />;
    }
    case Type.DeduplicateArrayWithSearch: {
      return <ListWithSearch<T> {...(props as any)} />;
    }
    default:
      return absurd(dataProvider);
  }
};

export default ListWithAnyDataProvider;
