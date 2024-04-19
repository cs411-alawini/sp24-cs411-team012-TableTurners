import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';
import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';

function Profile({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  if (!profile) return <Navbar toast={toast} profile={profile} />;

  const [checked, setChecked] = useState(false);
  return (
    <>
      <Navbar toast={toast} profile={profile} />
      <h1>Profile</h1>
      <p>First Name: {profile.first_name}</p>
      <p>Last Name: {profile.last_name}</p>
      <p>Email Address: {profile.email_addr}</p>
      <p>Save History</p>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </>
  );
}

export default Profile;
