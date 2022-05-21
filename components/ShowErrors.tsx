import * as React from 'react';

type Props = {
  errors: Error[];
};
const ShowErrors = (props: Props) => {
  const { errors } = props;
  return (
    <div
      style={{
        border: '1px solid red',
        color: 'red',
        margin: '1rem 0 1rem 0',
        padding: '1rem 1rem 1rem 1rem',
      }}
    >
      {errors.map((er, index) => {
        return <div key={index}>{er.message}</div>;
      })}
    </div>
  );
};

export default ShowErrors;
