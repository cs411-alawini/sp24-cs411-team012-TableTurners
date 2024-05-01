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

import './signup.css';
import limitInput from '../../utils/limit_input';

export default function Signup({ toast }: PageProps) {
  const navigate = useNavigate();

  // User input tooltips
  const tooltipEmail = useRef<Tooltip>(null);
  const [tooltipEmailMsg, setEmailTTip] = useState('');
  const tooltipFirst = useRef<Tooltip>(null);
  const [tooltipFirstMsg, setFirstTTip] = useState('');
  const tooltipLast = useRef<Tooltip>(null);
  const [tooltipLastMsg, setLastTTip] = useState('');

  // State object for button loading
  const [loading, setLoading] = useState(false);

  // User inputs
  const [email, setEmail] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [password, setPassword] = useState('');

  // Error info message
  const [errorText, setErrorText] = useState<string>('');
  const [showErrorMsg, setShowErrorMsg] = useState(false); // Holds state of error msg (shown or hidden), and function to set it

  // Validate inputs and call API to create account
  function submit() {
    if (email.length > 256) {
      toast.current?.show({
        severity: 'error',
        summary: 'Email Invalid',
        detail: 'Maximum email length is 256 characters.',
      });
      return;
    }
    if (firstName.length > 256) {
      toast.current?.show({
        severity: 'error',
        summary: 'First Name Invalid',
        detail: 'Maximum first name length is 256 characters.',
      });
      return;
    }
    if (lastName.length > 256) {
      toast.current?.show({
        severity: 'error',
        summary: 'Last Name Invalid',
        detail: 'Maximum last name length is 256 characters.',
      });
      return;
    }

    setLoading(true);
    api
      .post_signup(email, password, firstName, lastName)
      .then((response_status) => {
        if (response_status === 201) {
          /* Successful */
          navigate('/profile');
        } else if (response_status === 400) {
          /* Bad Request (Client-Sided) */
          setErrorText('Missing information. Please fill out the appropriate field and try again!');
          setShowErrorMsg(true);
        } else if (response_status === 500) {
          /* Internal server Error */
          setErrorText('The user may already exist or the password failed to hash. Please try again!');
          setShowErrorMsg(true);
        } else {
          setErrorText('An unknown error has occurred.');
          setShowErrorMsg(true);
        }
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to sign up',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }

  const email_input = (
    <div className="signup-input">
      <span className="p-input-icon-left">
        <i className="pi pi-at" style={{ paddingLeft: '5px' }} />
        <InputText
          placeholder="Email"
          style={{ paddingLeft: '30px' }}
          value={email}
          onChange={limitInput(tooltipEmail, setEmailTTip, setEmail, 'Maximum email length is 256 characters', 256)}
        />
      </span>
    </div>
  );
  const password_input = (
    <div className="signup-input">
      <span className="p-input-icon-left">
        <i className="pi pi-lock" style={{ paddingLeft: '5px' }} />
        <InputText
          placeholder="Password"
          type="password"
          style={{ paddingLeft: '30px' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </span>
    </div>
  );
  const firstname_input = (
    <div className="signup-input">
      <span className="p-input-icon-left">
        <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
        <InputText
          placeholder="First Name"
          style={{ paddingLeft: '30px' }}
          value={firstName}
          onChange={limitInput(tooltipFirst, setFirstTTip, setFirst, 'Maximum first name length is 256 characters', 256)}
        />
      </span>
    </div>
  );
  const lastname_input = (
    <div className="signup-input">
      <span className="p-input-icon-left">
        <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
        <InputText
          placeholder="Last Name"
          style={{ paddingLeft: '30px' }}
          value={lastName}
          onChange={limitInput(tooltipLast, setLastTTip, setLast, 'Maximum last name length is 256 characters', 256)}
        />
      </span>
    </div>
  );
  const error_msg = <div className="signup-input">{showErrorMsg && <Message severity="error" text={errorText} />}</div>;
  const submit_button = (
    <div className="signup-input">
      <Button
        id="signup-button"
        icon={PrimeIcons.SIGN_IN}
        onClick={(e) => {
          submit();
          e.preventDefault();
        }}
        loading={loading}
      >
        Submit
      </Button>
    </div>
  );

  return (
    <Card id="signup-card">
      <Tooltip content={tooltipEmailMsg} ref={tooltipEmail} />
      <Tooltip content={tooltipFirstMsg} ref={tooltipFirst} />
      <Tooltip content={tooltipLastMsg} ref={tooltipLast} />
      <h1>Sign Up</h1>
      <p>Please fill out the following information to sign up!</p>
      <form>
        {email_input}
        {password_input}
        {firstname_input}
        {lastname_input}
        {error_msg}
        {submit_button}
      </form>
    </Card>
  );
}
