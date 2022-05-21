import * as Data from "../../complex-data";
import * as React from "react";

import ShowErrors from "../ShowErrors";
import { useArrayDataProvider } from "../../data-providers/hooks";

type Props = {
  title: string;
};

const ComplexDataExample = (props: Props) => {
  const { title } = props;

  const dataProvider = useArrayDataProvider(Data.getFlightData as any)({
    offset: 0,
    take: 1,
  });

  const { next, selectAll, errors } = dataProvider;

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {selectAll.map((item, index) => {
          const { price, person, flight } = item;
          const {
            airline,
            flightNumber,
            flightLength,
            origin,
            destination,
            seat,
          } = flight;
          return (
            <div
              key={index}
              style={{
                border: "1px solid darkgrey",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <h2>{person}</h2>
              <div>
                {airline} {flightNumber}
              </div>
              <h4>Origin</h4>
              <div>
                {origin.name} ({origin.code})
              </div>
              <div>
                {origin.city}, {origin.country}
              </div>
              <h4>Destiniation</h4>
              <div>
                {destination.name} ({destination.code})
              </div>
              <div>
                {destination.city}, {destination.country}
              </div>
              <h4>Details</h4>
              <div>
                Seat: {seat} Flight Length{flightLength}
              </div>
              <div>Price: {price}</div>
            </div>
          );
        })}
      </div>
      {errors.length > 0 && <ShowErrors errors={errors} />}
      <button onClick={next}>Get another</button>
    </div>
  );
};

export default ComplexDataExample;
