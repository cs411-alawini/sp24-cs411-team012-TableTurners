import { useEffect, RefObject, useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';

const Login = lazy(() => import('./pages/Login/Login.tsx'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound.tsx'));
const Profile = lazy(() => import('./pages/Profile/Profile.tsx'));
const Search = lazy(() => import('./pages/Search/Search.tsx'));
const Signup = lazy(() => import('./pages/Signup/Signup.tsx'));
import { ProfileInfo } from './api/get_profile.ts';

import api from './api/api.ts';
import Navbar from './components/Navbar/Navbar.tsx';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

export type PageProps = { toast: RefObject<Toast>; profile?: ProfileInfo };

export default function Pages({ toast }: { toast: RefObject<Toast> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFail] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | undefined>();

  // Load user profile on each location change
  // Redirect from pages that need authenticate to /login if session is invalid
  // Redirects from /login and /signup to /profile if session is valid
  function loadProfile() {
    setLoading(profile === undefined);
    const needs_auth = ['/profile', '/search'];
    const redirect_profile = ['/', '/login', '/signup'];

    api
      .get_profile()
      .then((profile) => {
        setProfile(profile);
        setLoadFail(false);
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
        setProfile(undefined);
        setLoadFail(true);
        console.error(error);
        if (needs_auth.includes(location.pathname)) {
          toast.current?.show({
            severity: 'error',
            summary: 'Failed to fetch account',
            detail: `${error.message}. Try again later`,
          });
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadProfile, [location.pathname]);

  /**
   * @param PageComponent component container should hold
   * @param show_load if page should indicate while loading profile (i.e. /login should not show loading spinner, /profile should)
   * @returns JSX element of container
   */
  const Container = (PageComponent: JSX.Element, show_load: boolean) => {
    let content = <div id="content-container">{PageComponent}</div>;
    // If currently loading, and page should show loading spinner, content should be empty for now
    if (loading && show_load) {
      content = <></>;
    }
    // If load failed, and page should indicate this, show error message and retry button
    if (loadFailed && show_load) {
      content = (
        <div id="content-container">
          <p>Failed to load profile. Try again later.</p>
          <Button icon={PrimeIcons.REPLAY} loading={loading} onClick={loadProfile}>
            Retry
          </Button>
        </div>
      );
    }

    // Loading spinner element
    const load_screen = (
      <div id="profile-loading" style={{ opacity: loading ? 0.5 : 0, pointerEvents: loading ? 'all' : 'none' }}>
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>
        </div>
      </div>
    );

    return (
      <>
        <Navbar toast={toast} profile={profile} loadingProfile={loading} updateProfile={setProfile} />
        <Suspense
          fallback={
            <div id="profile-loading" style={{ opacity: 0.5, pointerEvents: loading ? 'all' : 'none' }}>
              <div>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
            </div>
          }
        >
          {content}
          {/* Show loading spinner on designated pages (i.e., profile, search) */}
          {show_load ? load_screen : <></>}
        </Suspense>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/" element={Container(<Login toast={toast} />, false)} />
      <Route path="/login" element={Container(<Login toast={toast} />, false)} />
      <Route path="/signup" element={Container(<Signup toast={toast} />, false)} />
      <Route path="/profile" element={Container(<Profile toast={toast} profile={profile} />, true)} />
      <Route path="/search" element={Container(<Search toast={toast} profile={profile} />, true)} />
      <Route path="/*" element={Container(<NotFound toast={toast} profile={profile} />, false)} />
    </Routes>
  );
}
