import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';

function Profile({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  return (
    <>
      <Navbar toast={toast} auth={true} profile={profile} />
      <h1>Profile</h1>
    </>
  );
}

export default Profile;
