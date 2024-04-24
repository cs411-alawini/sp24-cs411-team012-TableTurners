import { useState } from 'react';											// React hook used for managing state within functional components
import { useNavigate } from 'react-router-dom';				// React hook for navigation within the application, provided by React Router DOM
import { Button } from 'primereact/button';						// React button UI component
import { PrimeIcons } from 'primereact/api';					// Provides set of icon names
import { InputText } from 'primereact/inputtext';			// React input text box UI component
import api from '../../api/api';											// Imports API given by project
import { PageProps } from '../../Pages';							// Contains props passed to pages in application

/* 
	Keeping these for now, in case there are more complaints about types
	const [inputEmail, setInputEmail]: [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input email value, and defines function to handle changes to element
	const [inputPassword, setInputPassword]: [string, React.Dispatch<React.SetStateAction<string>>] = useState( '' );			// Holds input password value, and defines function to handle changes to element
*/

function Login({ toast }: PageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] 		= useState( false );
	const [inputEmail, setInputEmail]: [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input email value, and defines function to handle changes to element
	const [inputPassword, setInputPassword]: [string, React.Dispatch<React.SetStateAction<string>>] = useState( '' );			// Holds input password value, and defines function to handle changes to element

	/* Sets the const email upon new text being entered into the corresponding text box */
	function handleEmailChange( event: React.ChangeEvent<HTMLInputElement> ) {		
		setInputEmail( event.target.value )
	}

	/* Sets the const password upon new text being entered into the corresponding text box */
	function handlePasswordChange( event: React.ChangeEvent<HTMLInputElement> ) {
		setInputPassword( event.target.value )
	}

	/* Submits email and password to API for authentication */
  function submit() {
    setLoading(true);
    api
      .post_login(inputEmail, inputPassword)
      .then((authenticated) => {
        console.log( authenticated );
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

	/* Below contains the Frontend Elements */
  return (
    <>
      <h1> Login </h1>
		<div>
			{ /* InputText element for Email Box */ }
			<span className = "p-input-icon-left" >
				<i className = "pi pi-address-book" style = {{ paddingLeft: '5px' }} />
				<InputText 
					placeholder = "Email" 
					style={{ paddingLeft: '30px' }}
					value 			= { inputEmail }
					onChange		= { handleEmailChange }
				/>
			</span>
		</div>
		<div>
			{/* InputText element for Password box*/}
			<span className = "p-input-icon-left">
				<i className = "pi pi-lock" style = {{ paddingLeft: '5px' }}/>
				<InputText 
					placeholder = "Password" 
					style 			= { { paddingLeft: '30px' } }
					value 			= { inputPassword }
					onChange		= { handlePasswordChange }
				/>
			</span>	
		</div>
	  { /* Button element to initiate login*/ }
		{/*'root3544@Zyxel.com', '1234' is example email/pass*/}
	  <Button
        icon={PrimeIcons.SIGN_IN}
        onClick={() => submit() /* Replace this with proper submit call with user input */}
        loading={loading}
      >
        Login
      </Button>
    </>
  );
}

export default Login;
