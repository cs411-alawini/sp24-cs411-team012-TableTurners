import { Dispatch, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { Skeleton } from 'primereact/skeleton';
import { Ripple } from 'primereact/ripple';

import './navbar.css';

import api from '../../api/api';
import { PageProps } from '../../Pages';
import { ProfileInfo } from '../../api/get_profile';

function Navbar({
  toast,
  profile,
  loadingProfile,
  updateProfile,
}: PageProps & { loadingProfile?: boolean; updateProfile: Dispatch<ProfileInfo | undefined> }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  function logout() {
    setLoading(true);
    api
      .get_logout()
      .then(() => {
        updateProfile(undefined);
        navigate('/login');
      })
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

  const linkClass = (path: string) => (location.pathname === path ? 'p-ripple activelink navlink' : 'p-ripple navlink');

  const logo_link = (() => {
    const path_mapping: { [key: string]: string } = {
      '/search': '/profile',
      '/profile': '/search',
      '/login': '/signup',
      '/signup': '/login',
      '/': '/signup',
    };
    if (!path_mapping[location.pathname]) {
      if (profile) return '/search';
      return '/login';
    }
    return path_mapping[location.pathname];
  })();

  // If waiting for loading on unauthenticated page
  let nav_links = (
    <>
      <div className="navlink">
        <div>
          <Skeleton width="3rem"></Skeleton>
        </div>
      </div>
      <div className="navlink">
        <Button loading={true}>
          <Skeleton width="3.65rem" height="1.25rem"></Skeleton>
        </Button>
      </div>
    </>
  );
  // If waiting for loading on an authenticated page
  if (['/profile', '/search'].includes(location.pathname)) {
    nav_links = (
      <>
        <div className="navlink">
          <div>
            <Skeleton width="4rem"></Skeleton>
          </div>
        </div>
        <div className="navlink">
          <div>
            <Skeleton width="6rem"></Skeleton>
          </div>
        </div>
        <div className="navlink">
          <Button loading={true}>
            <Skeleton width="3.70rem" height="1.25rem"></Skeleton>
          </Button>
        </div>
      </>
    );
  }
  // If logged in
  if (!loadingProfile && profile) {
    nav_links = (
      <>
        <Link to={'/search'} className={linkClass('/search')}>
          <div>Search</div>
          <Ripple />
        </Link>
        <Link to={'/profile'} className={linkClass('/profile')}>
          <div>Profile ({profile?.first_name})</div>
          <Ripple />
        </Link>
        <div className="p-ripple navlink">
          <Button onClick={() => logout()} loading={loading} icon={PrimeIcons.SIGN_OUT}>
            Logout
          </Button>
        </div>
      </>
    );
  }
  // If logged out
  if (!loadingProfile && !profile) {
    nav_links = (
      <>
        <Link to={'/login'} className={linkClass('/login')}>
          <div>Login</div>
          <Ripple />
        </Link>
        <div className={linkClass('/signup')}>
          <Button onClick={() => navigate('/signup')} icon={PrimeIcons.USER_PLUS}>
            Sign Up
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="navparent" style={{ maxHeight: navOpen ? '15rem' : undefined }}>
        <div id="navleft">
          <Link to={logo_link} id="sitename">
            <p>Grocery Aid</p>
          </Link>
          <div id="navopen">
            <Button onClick={() => setNavOpen(!navOpen)} icon={navOpen ? PrimeIcons.TIMES : PrimeIcons.BARS}></Button>
          </div>
        </div>
        <div id="navright">{nav_links}</div>
      </div>
    </>
  );
}

export default Navbar;
