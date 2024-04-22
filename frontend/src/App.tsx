import { useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { PrimeReactProvider } from 'primereact/api';
import { ConfirmDialog } from 'primereact/confirmdialog';

import Pages from './Pages.tsx';

function App() {
  const toast = useRef<Toast>(null);

  return (
    <>
      <PrimeReactProvider>
        <Toast ref={toast} />
        <ConfirmDialog />
        <BrowserRouter>
          <Pages toast={toast} />
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
