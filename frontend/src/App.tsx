import { useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { APIOptions, PrimeReactProvider } from 'primereact/api';
import { ConfirmDialog } from 'primereact/confirmdialog';

import Pages from './Pages.tsx';

function App() {
  const toast = useRef<Toast>(null);

  const primereact_config: APIOptions = {
    ripple: true,
  };

  return (
    <>
      <PrimeReactProvider value={primereact_config}>
        <Toast ref={toast} position="bottom-right" />
        <ConfirmDialog />
        <BrowserRouter>
          <Pages toast={toast} />
        </BrowserRouter>
      </PrimeReactProvider>
    </>
  );
}

export default App;
