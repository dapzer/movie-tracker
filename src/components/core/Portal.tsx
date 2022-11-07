import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
}

const Portal: FC<Props> = ({ children }) => {
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};

export default Portal;
