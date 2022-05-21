import * as React from 'react';
import ListWithAnyDataProvider from './ListWithAnyDataProvider';
import ListWithDataProviderHook from './ListWithDataProviderHook/ListWithSearch';
import ComplexDataExample from './ListWithDataProviderHook/ComplexDataExample';
import * as Data from '../data';
import { Car } from '../data';

import { create } from '../data-providers';

const allCarTemplate = (car: Car) => (
  <span>
    {car.year} {car.make} {car.model}
  </span>
);

const makeAndModelTemplate = (car: Car) => (
  <span>
    {car.make} {car.model}
  </span>
);

const makeAndYearTemplate = (car: Car) => (
  <span>
    {car.year} {car.make}
  </span>
);

const BasePage = () => {
  const query = { offset: 0, take: 5 };

  const allCars = create<Car>(Data.getCars, {
    query,
  });

  const allCarsWithSearch = create<Car>(Data.getCars, {
    search: Data.searchAll,
    query,
  });

  const allCarsWithFuzzySearch = create<Car>(Data.getCars, {
    search: Data.fuzzySearch(2),
    query,
  });

  const byMakeAndModel = create<Car>(Data.getCars, {
    query,
    deduplicate: Data.eqMakeAndModel,
  });

  const byMakeAndYearWithSearch = create<Car>(Data.getCars, {
    search: Data.searchMakeAndYear,
    query,
    deduplicate: Data.eqMakeAndYear,
  });

  return (
    <div>
      <ComplexDataExample title="Flight Data" />
      <hr />

      <ListWithAnyDataProvider
        title="All Cars"
        dataProvider={allCars}
        ord={Data.ordByModel}
        template={allCarTemplate}
      />
      <hr />
      <ListWithAnyDataProvider
        title="All Cars With Search"
        dataProvider={allCarsWithSearch}
        ord={Data.ordByModel}
        template={allCarTemplate}
      />
      <hr />
      <ListWithAnyDataProvider
        title="All Cars With Bad Fuzzy Search"
        dataProvider={allCarsWithFuzzySearch}
        ord={Data.ordByModel}
        template={allCarTemplate}
      />
      <hr />

      <ListWithAnyDataProvider
        title="Deduplicate Make And Model"
        dataProvider={byMakeAndModel}
        ord={Data.ordByMake}
        template={makeAndModelTemplate}
      />
      <hr />

      <ListWithAnyDataProvider
        title="Deduplicate Make and Year With Search"
        dataProvider={byMakeAndYearWithSearch}
        ord={Data.ordByYear}
        template={makeAndYearTemplate}
      />
      <hr />

      <ListWithDataProviderHook title="Search All Cars Via Hook" />
    </div>
  );
};

export default BasePage;
