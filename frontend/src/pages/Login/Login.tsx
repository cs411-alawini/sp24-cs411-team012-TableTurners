import { useState } from 'react';											// React hook used for managing state within functional components
import { useNavigate } from 'react-router-dom';				// React hook for navigation within the application, provided by React Router DOM
import { Button } from 'primereact/button';						// React button UI component
import { PrimeIcons } from 'primereact/api';					// Provides set of icon names
import { InputText } from 'primereact/inputtext';			// React input text box UI component
import api from '../../api/api';											// Imports API given by project
import { PageProps } from '../../Pages';							// Contains props passed to pages in application

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
      <h1> Login </h1>
		<div>
			{ /* InputText element for Email Box */ }
			<span className = "p-input-icon-left" >
				<i className = "pi pi-address-book" style = {{ paddingLeft: '5px' }} />
				<InputText 
					placeholder = "Email" 
					style={{ paddingLeft: '30px' }} />
			</span>
		</div>
		<div>
			{/* InputText element for Password box*/}
			<span className = "p-input-icon-left">
				<i className = "pi pi-lock" style = {{ paddingLeft: '5px' }}/>
				<InputText 
					placeholder = "Password" 
					style={{ paddingLeft: '30px' }} />
			</span>	
		</div>
	  { /* Button element to initiate login*/ }
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
