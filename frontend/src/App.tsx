import { useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import Pages from './Pages.tsx';
import { PrimeReactProvider } from 'primereact/api';

function App() {
  const toast = useRef<Toast>(null);

  return (
    <>
      <PrimeReactProvider>
        <Toast ref={toast} />
        <BrowserRouter>
          <Pages toast={toast} />
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
