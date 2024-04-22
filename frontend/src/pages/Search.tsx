import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';

function Search({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  if (!profile) return <Navbar toast={toast} profile={profile} />;

  return (
    <>
      <Navbar toast={toast} profile={profile} />
      <div id="content-container">
        <h1>Search</h1>
      </div>
    </>
  );
}

export default Search;
