import { RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import './navbar.css';

import api from '../api/api';
import { Button } from 'primereact/button';
import { ProfileInfo } from '../api/get_profile';

function Navbar({ profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  const navigate = useNavigate();

  function logout() {
    api
      .get_logout()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
      });
  }

  if (profile) {
    return (
      <>
        <div id="navparent">
          <div id="navleft">
            <Link to={'/search'}>
              <p id="sitename">Grocery Aid</p>
            </Link>
          </div>
          <div id="navright">
            <Link to={'/search'} className="navlink">
              Search
            </Link>
            <Link to={'/profile'} className="navlink">
              Profile ({profile?.first_name})
            </Link>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="navparent">
        <div id="navleft">
          <Link to={'/profile'}>
            <p id="sitename">Grocery Aid</p>
          </Link>
        </div>
        <div id="navright">
          <Link to={'/login'} className="navlink">
            Login
          </Link>
          <Link to={'/signup'} className="navlink" style={{ marginRight: '0' }}>
            <Button>Signup</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
