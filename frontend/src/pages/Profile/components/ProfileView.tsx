import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { confirmDialog } from 'primereact/confirmdialog';

import api from '../../../api/api';
import { PageProps } from '../../../Pages';

export default function ProfileView({ toast, profile }: PageProps) {
  if (!profile) return <></>;
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  function delete_account() {
    setLoading(true);
    api
      .post_del_account()
      .then((success) => {
        if (success) {
          toast.current?.show({ severity: 'success', summary: 'Account Deleted' });
          navigate('/signup');
        } else {
          toast.current?.show({ severity: 'success', summary: 'Failed to delete account', detail: 'Are you logged in?' });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to delete account',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <p>
        <b>First Name: </b> {profile.first_name}
      </p>
      <p>
        <b>Last Name: </b> {profile.last_name}
      </p>
      <p>
        <b>Email Address: </b> {profile.email_addr}
      </p>
      <Divider />
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <p style={{ marginRight: '0.5rem' }}>
          <b>Save History: </b>
        </p>
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
    </>
  );
}