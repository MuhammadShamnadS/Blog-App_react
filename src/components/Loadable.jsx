import React, { Suspense } from 'react';

function Loadable({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}

export default Loadable;
