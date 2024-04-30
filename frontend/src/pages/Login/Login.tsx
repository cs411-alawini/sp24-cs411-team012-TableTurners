import { useState } from 'react'; // React hook used for managing state within functional components
import { useNavigate } from 'react-router-dom'; // React hook for navigation within the application, provided by React Router DOM
import { Button } from 'primereact/button'; // React button UI component
import { PrimeIcons } from 'primereact/api'; // Provides set of icon names
import { InputText } from 'primereact/inputtext'; // React input text box UI component
import api from '../../api/api'; // Imports API given by project
import { PageProps } from '../../Pages'; // Contains props passed to pages in application
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';

import './login.css';

function Login({ toast }: PageProps) {
  const navigate = useNavigate(); // Navigation object for page redirection

  const [loading, setLoading] = useState(false); // State object for button loading
  const [inputEmail, setInputEmail]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input email value, and defines function to handle changes to element
  const [inputPassword, setInputPassword]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input password value, and defines function to handle changes to element

  const [errorText, setErrorText] = useState<string>(''); // Holds appropriate text for error msg, and function to set it
  const [showErrorMsg, setShowErrorMsg] = useState(false); // Holds state of error msg (shown or hidden), and function to set it

  /* Sets the const email upon new text being entered into the corresponding text box */
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputEmail(event.target.value); // Set to target value given by event
  }

  /* Sets the const password upon new text being entered into the corresponding text box */
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputPassword(event.target.value); // Set to target value given by event
  }

  /* Submits email and password to API for authentication */
  function submit() {
    setLoading(true); // Set the loading button accordingly
    setShowErrorMsg(false); // Remove error message if present
    api
      .post_login(inputEmail, inputPassword) // Use post_login method to submit a login request
      .then((response_status) => {
        // Get response from API and act accordingly

        /* Check if successful */
        if (response_status === 200) {
          /* Return code 200 = success, navigate to profile page */
          navigate('/profile');
        }

        /* Else, check for error code and set error msg as appropriate */
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
          return;
        }
      })
      /* If any other error, then display bc we don't know what occurred */
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: 'Failed to log in', detail: `${error.message}. Try again later` });
      })
      /* Finally, set the loading icon for button to false to reset */
      .finally(() => setLoading(false));
  }

  /* Below contains the Frontend Elements */
  return (
    <Card id="login-card">
      <h1> Login </h1>
      <form>
        <div className="login-input">
          {/* InputText element for Email Box */}
          <span className="p-input-icon-left">
            <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
            <InputText placeholder="Email" style={{ paddingLeft: '30px' }} value={inputEmail} onChange={handleEmailChange} />
          </span>
        </div>
        <div className="login-input">
          {/* InputText element for Password box*/}
          <span className="p-input-icon-left">
            <i className="pi pi-lock" style={{ paddingLeft: '5px' }} />
            <InputText
              placeholder="Password"
              type="password"
              style={{ paddingLeft: '30px' }}
              value={inputPassword}
              onChange={handlePasswordChange}
            />
          </span>
        </div>
        {/* Message object for error message */}
        {showErrorMsg && (
          <div className="login-input">
            <Message severity="error" text={errorText} />
          </div>
        )}
        {/* Button element to initiate login*/}
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
      </form>
    </Card>
  );
}

export default Login;
