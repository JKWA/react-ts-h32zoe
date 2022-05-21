import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as Mock from '@ngneat/falso';
import { toError } from 'fp-ts/Either';
import { randomInt } from 'fp-ts/Random';

// mocks making multiple sequential calls to flaky endpints to retrieve data.

export type FlightOutput = {
  readonly person: string;
  readonly flight: Mock.FlightDetails;
  readonly price: string;
};

export type Flight = () => TE.TaskEither<Error, FlightOutput>;

const randomTimeout = randomInt(500, 2000);

const mockIt = (value) => {
  return TE.tryCatch((): Promise<any> => {
    return new Promise((resolve) => {
      if (Math.random() < 0.1) {
        throw 'The task errored';
      }
      setTimeout(() => {
        resolve(value);
      }, randomTimeout());
    });
  }, toError);
};

const getPerson = (): TE.TaskEither<Error, string> => {
  return pipe(mockIt(`${Mock.randFirstName()} ${Mock.randLastName()}`));
};

const getFlight = (x: { person: string }) => {
  return pipe(mockIt(Mock.randFlightDetails({ passenger: x.person })));
};

const getPrice = (x: { person: string; flight: Mock.FlightDetails }) => {
  return pipe(
    mockIt(
      randomInt(400, 1200)().toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    )
  );
};

// bind is fp-ts verson of Haskell's Do block
export const getFlightData: Flight = () => {
  return pipe(
    getPerson(),
    TE.bindTo('person'),
    TE.bind('flight', getFlight),
    TE.bind('price', getPrice)
  );
};
