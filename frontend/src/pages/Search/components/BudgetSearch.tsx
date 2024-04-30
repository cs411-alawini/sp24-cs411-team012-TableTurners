import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import { SearchMetadata } from '../Search';
import { useNavigate } from 'react-router-dom';
import { SetStateAction, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import api from '../../../api/api';
import { budget_results } from '../../../api/post_search_budget';
import { InputNumber } from 'primereact/inputnumber';
import formatPrice from '../../../utils/format_price';

export default function BudgetSearch({ stores, page_props: { toast }, foodgroups, refetchMeta }: SearchMetadata) {
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
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchBudget, setSearchBudget] = useState(0);
  const [searchResults, setSearchResults] = useState<budget_results | undefined>();

  function search() {
    if (searchString === '') {
      toast.current?.show({
        severity: 'error',
        summary: 'Search string cannot be empty',
      });
      return;
    }

    setSearchResults(undefined);
    setLoading(true);
    setShowResults(false);
    api
      .post_search_budget(searchString, searchBudget)
      .then((budget_results: SetStateAction<budget_results | undefined>) => {
        if (!budget_results) return navigate('/login');
        setSearchResults(budget_results);
      })
      .catch((error: { message: any }) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to run search',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => {
        setLoading(false);
        setShowResults(true);
      });
  }

  let results = <></>;
  if (searchResults) {
    results = (
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
    );
  }

  return (
    <>
      <form style={{ width: '100%', display: 'flex', marginBottom: '2rem' }}>
        <InputText
          disabled={loading}
          value={searchString}
          placeholder="Comma Separated Query"
          onChange={(e) => {
            setShowResults(false);
            setSearchString(e.target.value);
          }}
          style={{ flexGrow: 2, margin: '0 0.5rem 0 0' }}
        />
        <InputNumber
          placeholder="Budget"
          mode="currency"
          currency="USD"
          value={searchBudget}
          onValueChange={(e) => {
            setShowResults(false);
            setSearchBudget(e.value ? e.value : 0);
          }}
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
      <div id="search-results">
        <div id="search-loading" style={{ opacity: loading ? 0.5 : 0, pointerEvents: loading ? 'all' : 'none' }}>
          <div>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>{' '}
          </div>
        </div>
        <div style={{ opacity: showResults ? 1 : 0, transition: showResults ? '' : 'opacity 0.2s' }}>{results}</div>
      </div>
    </>
  );
}
