import { Card } from 'primereact/card';

import { PageProps } from '../../Pages';
import ProfileView from './components/ProfileView';
import HistoryView from './components/HistoryView';

function Profile({ toast, profile }: PageProps) {
  if (!profile) return <></>;
  return (
    <>
      <Card>
        <h1 style={{ marginTop: 0 }}>Profile</h1>
        <ProfileView toast={toast} profile={profile} />
      </Card>

      <h1>Search History</h1>
      <HistoryView toast={toast} profile={profile} />
    </>
  );
}

export default Profile;
