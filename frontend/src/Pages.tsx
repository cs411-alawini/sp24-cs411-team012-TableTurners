import { useEffect, RefObject, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';

import 'primereact/resources/themes/nano/theme.css';
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

import Login from './pages/Login.tsx';
import NotFound from './pages/NotFound.tsx';
import Profile from './pages/Profile.tsx';
import Search from './pages/Search.tsx';
import Signup from './pages/Signup.tsx';
import { ProfileInfo } from './api/get_profile.ts';

import api from './api/api.ts';

function Pages({ toast }: { toast: RefObject<Toast> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ProfileInfo | undefined>();

  // Load user profile on each location change
  // Redirect from pages that need authenticate to /login if session is invalid
  // Redirects from /login and /signup to /profile if session is valid
  useEffect(() => {
    const needs_auth = location.pathname !== '/login' && location.pathname !== '/signup';

    // Unauthenticated if cookie doesn't exist
    const cookies = new Cookies();
    if (!cookies.get('connect.sid') && needs_auth) navigate('/login');

    api
      .get_profile()
      .then((profile) => {
        if (!profile && needs_auth) return navigate('/login');
        if (profile && !needs_auth) return navigate('/profile');
        if (!profile) return;

        setProfile(profile);
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message });
      });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login toast={toast} />} />
      <Route path="/login" element={<Login toast={toast} />} />
      <Route path="/signup" element={<Signup toast={toast} />} />
      <Route path="/profile" element={<Profile toast={toast} profile={profile} />} />
      <Route path="/search" element={<Search toast={toast} profile={profile} />} />
      <Route path="/*" element={<NotFound toast={toast} profile={profile} />} />
    </Routes>
  );
}

export default Pages;
