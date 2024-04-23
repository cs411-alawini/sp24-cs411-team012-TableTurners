import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './navbar.css';

import api from '../api/api';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { PageProps } from '../Pages';
import { Skeleton } from 'primereact/skeleton';

function Navbar({ toast, profile, loadingProfile }: PageProps & { loadingProfile?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function logout() {
    setLoading(true);
    api
      .get_logout()
      .then(() => navigate('/login'))
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to logout',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }

  if (loadingProfile) {
    return (
      <>
        <div id="navparent">
          <div id="navleft">
            <p id="sitename">Grocery Aid</p>
          </div>
          <div id="navright">
            <a className="navlink">
              <Skeleton width="4rem"></Skeleton>
            </a>
            <a className="navlink">
              <Skeleton width="6rem"></Skeleton>
            </a>
            <Button loading={true}>
              <Skeleton width="3.70rem" height="1.25rem"></Skeleton>
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (profile) {
    const logo_link = location.pathname === '/search' ? '/profile' : '/search';
    return (
      <>
        <div id="navparent">
          <div id="navleft">
            <Link to={logo_link}>
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
            <Button onClick={() => logout()} loading={loading} icon={PrimeIcons.SIGN_OUT}>
              Logout
            </Button>
          </div>
        </div>
      </>
    );
  }

  const logo_link = location.pathname === '/login' ? '/signup' : '/login';
  return (
    <>
      <div id="navparent">
        <div id="navleft">
          <Link to={logo_link}>
            <p id="sitename">Grocery Aid</p>
          </Link>
        </div>
        <div id="navright">
          <Link to={'/login'} className="navlink">
            Login
          </Link>
          <Link to={'/signup'} className="navlink" style={{ marginRight: '0' }}>
            <Button icon={PrimeIcons.USER_PLUS}>Sign Up</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
