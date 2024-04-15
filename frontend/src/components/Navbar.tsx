import { RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';

import './navbar.css';

import api from '../api/api';
import { Button } from 'primereact/button';
import { ProfileInfo } from '../api/get_profile';

function Navbar({ auth, profile }: { toast: RefObject<Toast>; auth: boolean; profile?: ProfileInfo }) {
  const navigate = useNavigate();

  function logout() {
    api.get_logout().catch((error) => {
      // notify user of error
      console.error(error);
    });
    new Cookies().remove('connect.sid');
    navigate('/login');
  }

  if (!auth) {
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

  if (!profile) return <></>;

  return (
    <>
      <div id="navparent">
        <div id="navleft">
          <Link to={'/profile'}>
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

export default Navbar;
