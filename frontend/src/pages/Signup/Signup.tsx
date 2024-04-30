import { useState } from 'react'; // React hook used for managing state within functional components
import { Button } from 'primereact/button'; // React button UI component
import { PrimeIcons } from 'primereact/api'; // Provides set of icon names
import { InputText } from 'primereact/inputtext'; // React input text box UI component
import api from '../../api/api'; // Imports API given by project
import { PageProps } from '../../Pages'; // Contains props passed to pages in application
import { Message } from 'primereact/message'; // React message component to display messages on screen when appropriate
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';

import './signup.css';

function Signup({ toast }: PageProps) {
  const [loading, setLoading] = useState(false); // State object for button loading
  const [email, setEmail]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input email_addr value, and defines function to handle changes to element
  const [firstName, setFirstName]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input first_name value, and defines function to handle changes to element
  const [lastName, setLastName]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input first_name value, and defines function to handle changes to element
  const [password, setPassword]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(''); // Holds input first_name value, and defines function to handle changes to element

  const navigate = useNavigate();
  const [errorText, setErrorText] = useState<string>(''); // Holds appropriate text for error msg, and function to set it
  const [showErrorMsg, setShowErrorMsg] = useState(false); // Holds state of error msg (shown or hidden), and function to set it

  /* Sets the const email upon new text being entered into the corresponding text box */
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  /* Sets the const firstName upon new text being entered into the corresponding text box */
  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  /* Sets the const lastName upon new text being entered into the corresponding text box */
  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  /* Sets the const lastName upon new text being entered into the corresponding text box */
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  /* Submits the user information to API for processing */
  function submit() {
    /* Set button as loading and hide messages */
    setLoading(true);

    /* Call API method to submit request and evaluate returned status */
    api
      .post_signup(email, password, firstName, lastName)
      .then((response_status) => {
        /* Evaluate return status */
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

        return;
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

  return (
    <Card id="signup-card">
      <h1>Sign Up</h1>
      <p>Please fill out the following information to sign up!</p>
      {/* Input Text Box elements for user information */}
      <form>
        <div className="signup-input">
          <span className="p-input-icon-left">
            <i className="pi pi-at" style={{ paddingLeft: '5px' }} />
            <InputText placeholder="Email" style={{ paddingLeft: '30px' }} value={email} onChange={handleEmailChange} />
          </span>
        </div>
        <div className="signup-input">
          <span className="p-input-icon-left">
            <i className="pi pi-lock" style={{ paddingLeft: '5px' }} />
            <InputText
              placeholder="Password"
              type="password"
              style={{ paddingLeft: '30px' }}
              value={password}
              onChange={handlePasswordChange}
            />
          </span>
        </div>
        <div className="signup-input">
          <span className="p-input-icon-left">
            <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
            <InputText
              placeholder="First Name"
              style={{ paddingLeft: '30px' }}
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </span>
        </div>
        <div className="signup-input">
          <span className="p-input-icon-left">
            <i className="pi pi-address-book" style={{ paddingLeft: '5px' }} />
            <InputText
              placeholder="Last Name"
              style={{ paddingLeft: '30px' }}
              value={lastName}
              onChange={handleLastNameChange}
            />
          </span>
        </div>
        {/* Message object for error message */}
        {showErrorMsg && (
          <div className="signup-input">
            <Message severity="error" text={errorText} />
          </div>
        )}
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
      </form>
    </Card>
  );
}

export default Signup;
