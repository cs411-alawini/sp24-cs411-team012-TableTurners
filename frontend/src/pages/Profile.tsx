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
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

function convertDateString(date: string) {
  const format_config: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(date).toLocaleDateString(undefined, format_config);
}

function Profile({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  if (!profile) return <Navbar toast={toast} profile={profile} />;

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History | undefined>(undefined);

  // Grab history on first load
  useEffect(() => {
    api
      .get_history()
      .then((h) => {
        if (!h) return navigate('/login');
        // h.map((v) => {
        //   v.timestamp = convertDateString(v.timestamp);
        // });
        setHistory(h);
      })
      .catch((error) => {
        // notify user of error
        setHistory([]);
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message, detail: 'Try again later' });
      });
  }, []);

  function delete_account() {
    setLoading(true);
    api
      .post_del_account()
      .then((success) => {
        setLoading(false);
        if (success) {
          toast.current?.show({ severity: 'success', summary: 'Account Deleted' });
          navigate('/signup');
        } else {
          toast.current?.show({ severity: 'success', summary: 'Failed to delete account', detail: 'Are you logged in?' });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to delete account',
          detail: `${error.message}. Try again later`,
        });
      });
  }
  console.log(history);
  return (
    <>
      <Navbar toast={toast} profile={profile} />
      <ConfirmDialog />
      <div id="content-container">
        <Card>
          <h1>Profile</h1>
          <Divider />
          <p>First Name: {profile.first_name}</p>
          <p>Last Name: {profile.last_name}</p>
          <p>Email Address: {profile.email_addr}</p>
          <Divider />
          <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '0.5rem' }}>Save History: </p>
            <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
          </div>
          <Divider />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
            <Button
              icon={PrimeIcons.TRASH}
              severity="danger"
              onClick={() => {
                confirmDialog({
                  header: 'Delete Account ',
                  message: 'Are you sure you want to delete your account?',
                  accept: delete_account,
                });
              }}
              loading={loading}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        <h1>Search History</h1>
        <DataTable value={history} loading={history === undefined} emptyMessage="No History" style={{ minHeight: '10rem' }}>
          <Column field="search_string" header="Search" sortable />
          <Column
            field="timestamp"
            header="Timestamp"
            sortable
            style={{ width: '25%' }}
            body={(h) => convertDateString(h.timestamp)}
          />
        </DataTable>
      </div>
    </>
  );
}

export default Profile;
