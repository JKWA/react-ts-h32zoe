import { struct } from 'fp-ts/Eq';
import { Eq as eqNumber, Ord as ordNumber } from 'fp-ts/number';
import { Eq as eqString, Ord as ordString } from 'fp-ts/string';
import { Ord, contramap } from 'fp-ts/Ord';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import { toError } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Query } from './data-providers';

// mocks a flaky endpoint that returns a list of cars
export type Car = { year: number; make: string; model: string };

const carData: Car[] = [
  { make: 'Honda', model: 'Civic', year: 2019 },
  { make: 'Toyota', model: 'Highlander', year: 2013 },
  { make: 'Nissan', model: 'Maxima', year: 2018 },
  { make: 'Toyota', model: 'Sienna', year: 2013 },
  { make: 'Honda', model: 'Accord', year: 2005 },
  { make: 'Toyota', model: 'Highlander', year: 2013 },
  { make: 'Honda', model: 'Accord', year: 2004 },
  { make: 'Toyota', model: '4-Runner', year: 2013 },
  { make: 'Honda', model: 'Civic', year: 2004 },
  { make: 'Honda', model: 'Civic', year: 2004 },
  { make: 'Honda', model: 'Accord', year: 2013 },
  { make: 'Honda', model: 'Civic', year: 2018 },
  { make: 'Toyota', model: 'Highlander', year: 2021 },
  { make: 'GMC', model: 'Yukon', year: 2016 },
  { make: 'Nissan', model: 'Maxima', year: 2008 },
  { make: 'Nissan', model: 'Pathfinder', year: 2014 },
  { make: 'Toyota', model: 'Sienna', year: 2002 },
  { make: 'Honda', model: 'Accord', year: 2002 },
  { make: 'Toyota', model: 'Highlander', year: 2014 },
  { make: 'Honda', model: 'Accord', year: 2014 },
  { make: 'Toyota', model: '4-Runner', year: 2003 },
  { make: 'Honda', model: 'Civic', year: 2014 },
  { make: 'Nissan', model: 'Pathfinder', year: 2015 },
  { make: 'Honda', model: 'Civic', year: 2014 },
  { make: 'Nissan', model: 'Sentra', year: 2012 },
  { make: 'GMC', model: 'Yukon', year: 2015 },
  { make: 'Honda', model: 'Accord', year: 2013 },
  { make: 'GMC', model: 'Seirra', year: 2015 },
];

const mockCarQuery = (query: Query): Promise<Car[]> => {
  const { take, offset } = query;

  return new Promise((resolve) => {
    if (Math.random() < 0.33) {
      throw 'The task errored';
    }
    setTimeout(() => {
      resolve(carData.slice(offset, take + offset));
    }, 1500);
  });
};

// this is a safe promise (TaskEither)
// it is also possible to compose multiple calls from different endpoints
export const getCars = (query: Query): TaskEither<Error, Car[]> => {
  return pipe(tryCatch((): Promise<Car[]> => mockCarQuery(query), toError));
};

export const eqMakeAndModel = struct<Partial<Car>>({
  make: eqString,
  model: eqString,
});

export const eqMakeAndYear = struct<Partial<Car>>({
  make: eqString,
  year: eqNumber,
});

export const ordByMake: Ord<Car> = contramap((car: Car) => car.make)(ordString);
export const ordByModel: Ord<Car> = contramap((car: Car) => car.model)(
  ordString
);
export const ordByYear: Ord<Car> = contramap((car: Car) => car.year)(ordNumber);

export const searchAll =
  (search: string) =>
  (car: Car): boolean => {
    const { make, model, year } = car;
    if (!search) {
      return true;
    }
    return `${make} ${model} ${year}`
      .toLowerCase()
      .includes(search.toString().toLowerCase());
  };

export const fuzzySearch =
  (percent: number) =>
  (search: string) =>
  (car: Car): boolean => {
    const { make, model, year } = car;
    if (!search) {
      return true;
    }
    // standing in for a fuzzy library
    return (
      randomFuzzyLibrary(`${make} ${model} ${year}`, search.toString()) >
      percent / 100
    );
  };

export const searchMakeAndModel =
  (search: string) =>
  (car: Car): boolean => {
    const { make, model } = car;
    if (!search) {
      return true;
    }
    return `${make} ${model}`
      .toLowerCase()
      .includes(search.toString().toLowerCase());
  };

export const searchMakeAndYear =
  (search: string) =>
  (car: Car): boolean => {
    const { make, year } = car;
    if (!search) {
      return true;
    }
    return `${make} ${year}`
      .toLowerCase()
      .includes(search.toString().toLowerCase());
  };

function randomFuzzyLibrary(str1: string, str2: string): number {
  const getBigrams = (string) => {
    const s = string.toLowerCase();
    const v = new Array(s.length - 1);
    for (let i = 0; i < v.length; i++) {
      v[i] = s.slice(i, i + 2);
    }
    console.log('v', v);
    return v;
  };
  if (str1.length > 0 && str2.length > 0) {
    const pairs1 = getBigrams(str1);
    const pairs2 = getBigrams(str2);
    const union = pairs1.length + pairs2.length;
    let hit_count = 0;

    for (let x in pairs1) {
      for (let y in pairs2) {
        if (x === y) {
          hit_count++;
        }
      }
    }

    if (hit_count > 0) {
      return (2 * hit_count) / union;
    }
  }

  return 0.0;
}
