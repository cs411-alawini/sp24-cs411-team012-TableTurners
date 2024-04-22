import { RefObject, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import api from '../api/api';
import Navbar from '../components/Navbar';
import { PrimeIcons } from 'primereact/api';

function Login({ toast }: { toast: RefObject<Toast> }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function submit(email: string, password: string) {
    setLoading(true);
    api
      .post_login(email, password)
      .then((authenticated) => {
        if (!authenticated) {
          // notify user of incorrect email/password
          return;
        }
        setLoading(false);
        navigate('/profile');
      })
      .catch((error) => {
        // notify user of error
        setLoading(false);
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Failed to log in', detail: `${error.message}. Try again later` });
      });
  }

  return (
    <>
      <Navbar toast={toast} />
      <div id="content-container">
        <h1>Login</h1>
        <Button
          icon={PrimeIcons.SIGN_IN}
          onClick={() => submit('root3544@Zyxel.com', '1234') /* Replace this with proper submit call with user input */}
          loading={loading}
        >
          Login
        </Button>
      </div>
    </>
  );
}

export default Login;
