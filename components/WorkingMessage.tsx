import * as React from 'react';

type Props = {
  show: boolean;
  message: string;
};
const WorkingMessage = (props: Props) => {
  const { show, message } = props;
  return (
    <div>
      {show && (
        <div
          style={{
            border: '1px solid blue',
            color: 'blue',
            margin: '1rem 0 1rem 0',
            padding: '1rem 1rem 1rem 1rem',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default WorkingMessage;
