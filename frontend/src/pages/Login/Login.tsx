import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Tooltip } from 'primereact/tooltip';

import api from '../../api/api';
import { PageProps } from '../../Pages';

import './login.css';
import limitInput from '../../utils/limit_input';

export default function Login({ toast }: PageProps) {
  const navigate = useNavigate();

  // User input tooltips
  const tooltip = useRef<Tooltip>(null);
  const [tooltipMsg, setTooltipMsg] = useState('');

  // State object for button loading
  const [loading, setLoading] = useState(false);

  // User inputs
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  // Error info message
  const [errorText, setErrorText] = useState<string>('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  // Validate inputs and call API to login
  function submit() {
    if (inputEmail.length > 256) {
      toast.current?.show({
        severity: 'error',
        summary: 'Email Invalid',
        detail: 'Maximum email length is 256 characters.',
      });
      return;
    }

    setLoading(true);
    api
      .post_login(inputEmail, inputPassword)
      .then((response_status) => {
        // Return code 200 = success, navigate to profile page
        if (response_status === 200) navigate('/profile');

        // Else, check for error code and set error msg as appropriate
        if (response_status === 400) {
          setErrorText('Missing email or password!');
          setShowErrorMsg(true);
        } else if (response_status === 401) {
          setErrorText('User not found or password does not match');
          setShowErrorMsg(true);
        } else if (response_status === 500) {
          setErrorText('An error occurred with user or password');
          setShowErrorMsg(true);
        } else {
          setErrorText('An unknown error has occurred.');
          setShowErrorMsg(true);
        }
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Failed to log in', detail: `${error.message}. Try again later` });
      })
      .finally(() => setLoading(false));
  }

  const email_input = (
    <div className="login-input">
      <span className="p-input-icon-left">
        <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
        <InputText
          className="email"
          placeholder="Email"
          style={{ paddingLeft: '30px' }}
          value={inputEmail}
          onChange={limitInput(tooltip, setTooltipMsg, setInputEmail, 'Maximum email length is 256 characters', 256)}
        />
      </span>
    </div>
  );
  const password_input = (
    <div className="login-input">
      <span className="p-input-icon-left">
        <i className="pi pi-lock" style={{ paddingLeft: '5px' }} />
        <InputText
          placeholder="Password"
          type="password"
          style={{ paddingLeft: '30px' }}
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </span>
    </div>
  );
  const error_msg = <div className="login-input">{showErrorMsg && <Message severity="error" text={errorText} />}</div>;

  const submit_button = (
    <div className="login-input">
      <Button
        id="login-button"
        icon={PrimeIcons.SIGN_IN}
        onClick={(e) => {
          submit();
          e.preventDefault();
        }}
        loading={loading}
      >
        Login
      </Button>
    </div>
  );

  return (
    <Card id="login-card">
      <Tooltip content={tooltipMsg} ref={tooltip} />
      <h1> Login </h1>
      <form>
        {email_input}
        {password_input}
        {error_msg}
        {submit_button}
      </form>
    </Card>
  );
}
