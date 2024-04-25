import { useState } from 'react';											// React hook used for managing state within functional components
import { useNavigate } from 'react-router-dom';				// React hook for navigation within the application, provided by React Router DOM
import { Button } from 'primereact/button';						// React button UI component
import { PrimeIcons } from 'primereact/api';					// Provides set of icon names
import { InputText } from 'primereact/inputtext';			// React input text box UI component
import api from '../../api/api';											// Imports API given by project
import { PageProps } from '../../Pages';							// Contains props passed to pages in application

function Signup({ toast }: PageProps) {
  
	const navigate                  = useNavigate();
  const [loading, setLoading] 		= useState( false );
  const [email, setEmail]:          [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input email_addr value, and defines function to handle changes to element
  const [firstName, setFirstName]:  [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input first_name value, and defines function to handle changes to element
  const [lastName, setLastName]:    [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input first_name value, and defines function to handle changes to element
  const [password, setPassword]:    [string, React.Dispatch<React.SetStateAction<string>>]	= useState( '' );			// Holds input first_name value, and defines function to handle changes to element
  
	/* Sets the const email upon new text being entered into the corresponding text box */
	function handleEmailChange( event: React.ChangeEvent<HTMLInputElement> ) {		
		setEmail( event.target.value )
	}  

	/* Sets the const firstName upon new text being entered into the corresponding text box */
	function handleFirstNameChange( event: React.ChangeEvent<HTMLInputElement> ) {		
		setFirstName( event.target.value )
	}
  
	/* Sets the const lastName upon new text being entered into the corresponding text box */
	function handleLastNameChange( event: React.ChangeEvent<HTMLInputElement> ) {		
		setLastName( event.target.value )
	}

	/* Sets the const lastName upon new text being entered into the corresponding text box */
	function handlePasswordChange( event: React.ChangeEvent<HTMLInputElement> ) {		
		setPassword( event.target.value )
	}

  /* Submits the user information to API for processing */
  function submit(){
    setLoading( true );
    api
      .post_signup( email, password, firstName, lastName )
      .then( (success) => {
        if ( !success )
          // notify user of error
        return;
        
        /* Profile successfully created, navigate to profile page */
        navigate( '/profile' );
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
      <h1>Sign Up</h1>
      <p>Please fill out the following information to sign up!</p>
      { /* Input Text Box elements for user information */}
      <div>
        <span className = "p-input-icon-left" >
          <i className  = "pi pi-at" style = {{ paddingLeft: '5px' }} />
          <InputText 
            placeholder = "Email" 
            style       = {{ paddingLeft: '30px' }}
            value 			= { email }
            onChange		= { handleEmailChange }
          />
        </span>
      </div>
      <div>
        <span className = "p-input-icon-left" >
          <i className  = "pi pi-lock" style = {{ paddingLeft: '5px' }} />
          <InputText 
            placeholder = "Password" 
            style       = {{ paddingLeft: '30px' }}
            value 			= { password }
            onChange		= { handlePasswordChange }
          />
        </span>
      </div>
      <div>
        <span className = "p-input-icon-left" >
          <i className  = "pi pi-address-book" style = {{ paddingLeft: '5px' }} />
          <InputText 
            placeholder = "First Name" 
            style       = {{ paddingLeft: '30px' }}
            value 			= { firstName }
            onChange		= { handleFirstNameChange }
          />
        </span>
      </div>
      <div>
        <span className = "p-input-icon-left" >
          <i className  = "pi pi-address-book" style = {{ paddingLeft: '5px' }} />
          <InputText 
            placeholder = "Last Name" 
            style       = {{ paddingLeft: '30px' }}
            value 			= { lastName }
            onChange		= { handleLastNameChange }
          />
        </span>
      </div>
      <Button
        icon            = { PrimeIcons.SIGN_IN }
        onClick         = { () => submit() }
        loading         = { loading }
      >
        Submit
      </Button>

    </>
  );
}

export default Signup;
