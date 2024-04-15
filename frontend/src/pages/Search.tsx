import { RefObject } from 'react';
import { Toast } from 'primereact/toast';
import Navbar from '../components/Navbar';
import { ProfileInfo } from '../api/get_profile';

function Search({ toast, profile }: { toast: RefObject<Toast>; profile?: ProfileInfo }) {
  return (
    <>
      <Navbar toast={toast} auth={true} profile={profile} />
      <h1>Search</h1>
    </>
  );
}

export default Search;
