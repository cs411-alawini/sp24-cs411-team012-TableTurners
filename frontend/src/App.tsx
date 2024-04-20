import { useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import 'primereact/resources/themes/nano/theme.css';
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

import Pages from './Pages.tsx';

function App() {
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <BrowserRouter>
        <Pages toast={toast} />
      </BrowserRouter>
    </>
  );
}

export default App;
