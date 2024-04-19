import { RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import api from '../api/api';
import Navbar from '../components/Navbar';

function Login({ toast }: { toast: RefObject<Toast> }) {
  const navigate = useNavigate();

  function submit(email: string, password: string) {
    api
      .post_login(email, password)
      .then((authenticated) => {
        if (!authenticated) {
          // notify user of incorrect email/password
          return;
        }
        navigate('/profile');
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message });
      });
  }

  return (
    <>
      <Navbar toast={toast} />
      <h1>Login</h1>
      <Button
        onClick={() => submit('root3544@Zyxel.com', '1234') /* Replace this with proper submit call with user input */}
      >
        Login
      </Button>
    </>
  );
}

export default Login;
