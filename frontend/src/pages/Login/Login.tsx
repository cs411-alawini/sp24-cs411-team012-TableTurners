import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import api from '../../api/api';
import { PageProps } from '../../Pages';

function Login({ toast }: PageProps) {
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
        navigate('/profile');
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Failed to log in', detail: `${error.message}. Try again later` });
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h1>Login</h1>
      <Button
        icon={PrimeIcons.SIGN_IN}
        onClick={() => submit('root3544@Zyxel.com', '1234') /* Replace this with proper submit call with user input */}
        loading={loading}
      >
        Login
      </Button>
    </>
  );
}

export default Login;
