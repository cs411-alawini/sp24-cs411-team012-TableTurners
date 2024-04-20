import { RefObject } from 'react';
import { Toast } from 'primereact/toast';

import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';

function NotFound({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  return (
    <>
      <Navbar toast={toast} profile={profile} />
      <h1>404 Not Found</h1>
    </>
  );
}

export default NotFound;
