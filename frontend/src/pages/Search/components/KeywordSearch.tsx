import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tooltip } from 'primereact/tooltip';

import { SearchMetadata } from '../Search';
import api from '../../../api/api';
import { KeywordSearchResults } from '../../../api/post_search';
import formatPrice from '../../../utils/format_price';
import limitInput from '../../../utils/limit_input';

export default function KeywordSearchDisplay({ stores, page_props: { toast }, foodgroups, refetchMeta }: SearchMetadata) {
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
  const navigate = useNavigate();

  // User input tooltips
  const tooltip = useRef<Tooltip>(null);
  const [tooltipMsg, setTTMsg] = useState('');

  const [loading, setLoading] = useState(false);

  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState<KeywordSearchResults | undefined>();

  function search() {
    if (searchString === '') {
      toast.current?.show({
        severity: 'error',
        summary: 'Search string cannot be empty',
      });
      return;
    }
    if (searchString.length > 256) {
      toast.current?.show({
        severity: 'error',
        summary: 'Maximum search string length is 256 characters',
      });
      return;
    }

    setSearchResults(undefined);
    setLoading(true);
    api
      .post_search(searchString)
      .then((results) => {
        if (!results) return navigate('/login');
        setSearchResults(results);
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to execute keyword search',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }

  const results = (
    <div style={{ opacity: searchResults ? 1 : 0, transition: 'opacity 0.2s' }}>
      <DataTable
        value={searchResults}
        loading={loading}
        emptyMessage={<p>No Results Found</p>}
        style={{ minHeight: '20rem' }}
        paginator
        rows={25}
        rowsPerPageOptions={[25, 50, 100]}
      >
        <Column field="store_name" header="Store" sortable />
        <Column field="name" header="Product Name" sortable />
        <Column field="price" header="Price" sortable body={(p) => formatPrice(p.price)} />
      </DataTable>
    </div>
  );
  const search_bar = (
    <form style={{ width: '100%', display: 'flex', marginBottom: '2rem' }}>
      <InputText
        disabled={loading}
        placeholder="Search Query"
        value={searchString}
        onChange={limitInput(
          tooltip,
          setTTMsg,
          (e) => {
            setSearchString(e);
            setSearchResults(undefined);
          },
          'Maximum search string length is 256 characters',
          256,
        )}
        style={{ flexGrow: 1, margin: '0 0.5rem 0 0' }}
      />
      <Button
        icon={PrimeIcons.SEARCH}
        loading={loading}
        onClick={(e) => {
          search();
          e.preventDefault();
        }}
      >
        Search
      </Button>
    </form>
  );
  const loading_spinner = (
    <div id="search-loading" style={{ opacity: loading ? 0.5 : 0, pointerEvents: loading ? 'all' : 'none' }}>
      <div>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>{' '}
      </div>
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipMsg} ref={tooltip} position="bottom" />
      {search_bar}
      <div id="search-results">
        {results}
        {loading_spinner}
      </div>
    </>
  );
}
