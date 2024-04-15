import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';

function Signup({ toast }: { toast: RefObject<Toast> }) {
  return (
    <>
      <Navbar toast={toast} auth={false} />
      <h1>Signup</h1>
    </>
  );
}

export default Signup;
