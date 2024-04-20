import { RefObject, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';
import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';

import api from '../api/api';

import { History } from '../api/get_history';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';

function convertDateString(date: string) {
  const format_config: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString(undefined, format_config);
}
function Profile({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  if (!profile) return <Navbar toast={toast} profile={profile} />;

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [history, setHistory] = useState<History | undefined>(undefined);

  // Grab history on first load
  useEffect(() => {
    api
      .get_history()
      .then((h) => {
        // If unauthenticated, redirect to login
        if (!h) return navigate('/login');

        h.map((v) => {
          v.timestamp = convertDateString(v.timestamp);
        });
        setHistory(h);
      })
      .catch((error) => {
        // notify user of error
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message, detail: 'Try again later' });
      });
  }, []);

  return (
    <>
      <Navbar toast={toast} profile={profile} />
      <h1>Profile</h1>
      <p>First Name: {profile.first_name}</p>
      <p>Last Name: {profile.last_name}</p>
      <p>Email Address: {profile.email_addr}</p>
      <p>Save History</p>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />

      <h1>Search History</h1>
      <DataTable
        value={history}
        loading={history === undefined}
        lazy
        emptyMessage="No History"
        style={{ minHeight: '10rem' }}
      >
        <Column field="search_string" header="Search" sortable />
        <Column field="timestamp" header="Timestamp" sortable style={{ width: '25%' }} />
      </DataTable>
    </>
  );
}

export default Profile;
