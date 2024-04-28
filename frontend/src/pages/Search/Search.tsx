import { TabPanel, TabView } from 'primereact/tabview';
import { PageProps } from '../../Pages';
import KeywordSearch from './components/KeywordSearch';
import BudgetSearch from './components/BudgetSearch';
import { useEffect, useState } from 'react';
import api from '../../api/api';

import './search.css';
import { useNavigate } from 'react-router-dom';
import { StoreList } from '../../api/get_stores';
import { FoodGroups } from '../../api/get_foodgroups';
import StatSearch from './components/StatSearch';

export type SearchMetadata = { page_props: PageProps; stores?: StoreList; foodgroups?: FoodGroups; refetchMeta: () => void };

function Search({ toast, profile }: PageProps) {
  if (!profile) return <></>;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<SearchMetadata>({ page_props: { toast, profile }, refetchMeta: fetchMeta });

  function fetchMeta() {
    setLoading(true);
    const store_promise = api.get_stores();
    store_promise.then((stores) => {
      if (!stores) return navigate('/login');
      setMetadata(Object.assign(metadata, { stores }));
    });

    const food_promise = api.get_foodgroups();
    food_promise.then((foodgroups) => {
      if (!foodgroups) return navigate('/login');
      setMetadata(Object.assign(metadata, { foodgroups }));
    });

    Promise.all([store_promise, food_promise])
      .catch((error) => {
        setMetadata({ page_props: { toast, profile }, refetchMeta: fetchMeta });
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed fetch search metadata',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }
  useEffect(fetchMeta, []);

  let search_loading = <></>;
  if (loading) {
    search_loading = (
      <div id="search-loading" style={{ opacity: loading ? 0.5 : 0, pointerEvents: loading ? 'all' : 'none' }}>
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Search</h1>
      <div id="search-container">
        <TabView>
          <TabPanel header="Keyword Search">{loading ? <></> : <KeywordSearch {...metadata} />}</TabPanel>
          <TabPanel header="Search with Budget">{loading ? <></> : <BudgetSearch {...metadata} />}</TabPanel>
          <TabPanel header="Product Statistics">{loading ? <></> : <StatSearch {...metadata} />}</TabPanel>
        </TabView>
        {search_loading}
      </div>
    </>
  );
}

export default Search;
