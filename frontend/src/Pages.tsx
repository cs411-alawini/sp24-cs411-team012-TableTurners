import { useEffect, RefObject, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import Login from './pages/Login/Login.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Profile from './pages/Profile/Profile.tsx';
import Search from './pages/Search/Search.tsx';
import Signup from './pages/Signup/Signup.tsx';
import { ProfileInfo } from './api/get_profile.ts';

import api from './api/api.ts';
import Navbar from './components/Navbar.tsx';

export type PageProps = { toast: RefObject<Toast>; profile?: ProfileInfo };

function Pages({ toast }: { toast: RefObject<Toast> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ProfileInfo | undefined>();

  // Load user profile on each location change
  // Redirect from pages that need authenticate to /login if session is invalid
  // Redirects from /login and /signup to /profile if session is valid
  useEffect(() => {
    const needs_auth = ['/profile', '/search'];
    const redirect_profile = ['/login', '/signup'];

    api
      .get_profile()
      .then((profile) => {
        setProfile(profile);

        if (!profile && needs_auth.includes(location.pathname)) {
          toast.current?.show({ severity: 'error', summary: 'You need to login to view that page' });
          return navigate('/login');
        }
        if (profile && redirect_profile.includes(location.pathname)) {
          toast.current?.show({ severity: 'info', summary: 'Already logged in' });
          return navigate('/profile');
        }
        if (!profile) return;
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        if (needs_auth.includes(location.pathname)) {
          toast.current?.show({
            severity: 'error',
            summary: 'Failed to fetch account',
            detail: `${error.message}. Try again later`,
          });
        }
      });
  }, [location.pathname]);

  const Container = (PageComponent: JSX.Element) => {
    return (
      <>
        <Navbar toast={toast} profile={profile} />
        <div id="content-container">{PageComponent}</div>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={Container(<Login toast={toast} />)} />
      <Route path="/login" element={Container(<Login toast={toast} />)} />
      <Route path="/signup" element={Container(<Signup toast={toast} />)} />
      <Route path="/profile" element={Container(<Profile toast={toast} profile={profile} />)} />
      <Route path="/search" element={Container(<Search toast={toast} profile={profile} />)} />
      <Route path="/*" element={Container(<NotFound toast={toast} profile={profile} />)} />
    </Routes>
  );
}

export default Pages;
