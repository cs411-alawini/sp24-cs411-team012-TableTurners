import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';

function Signup({ toast }: { toast: RefObject<Toast> }) {
  return (
    <>
      <Navbar toast={toast} />
      <div id="content-container">
        <h1>Signup</h1>
      </div>
    </>
  );
}

export default Signup;
