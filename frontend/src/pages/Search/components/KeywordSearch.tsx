import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import { SearchMetadata } from '../Search';

export default function KeywordSearch({ stores, foodgroups, refetchMeta }: SearchMetadata) {
  if (!stores || !foodgroups) {
    return (
      <>
        <p>Failed to fetch search metadata. Try again later.</p>
        <Button icon={PrimeIcons.REFRESH} onClick={refetchMeta}>
          Retry
        </Button>
      </>
    );
  }

  return (
    <>
      <InputText />
      <Dropdown options={stores} />
      {/* Missing config to be able to update on selection. See PrimeReact docs if you need these dropdown */}
      <Dropdown options={foodgroups} />
    </>
  );
}
