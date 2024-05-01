import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import api from '../../../api/api';
import formatPrice from '../../../utils/format_price';
import { SearchMetadata } from '../Search';
import { StatResult, StatResults } from '../../../api/post_search_stats';
import limitInput from '../../../utils/limit_input';

function StatDisplay({ result }: { result: StatResult }) {
  const store_stats = (
    <table>
      <tbody>
        <tr>
          <th className="stat-label">Min Price:</th>
          <th className="stat-value">{formatPrice(result.min_price)}</th>
        </tr>
        <tr>
          <th className="stat-label">Max Price:</th>
          <th className="stat-value">{formatPrice(result.max_price)}</th>
        </tr>
        <tr>
          <th className="stat-label">Average Price:</th>
          <th className="stat-value">{formatPrice(result.avg_price)}</th>
        </tr>
        <tr>
          <th className="stat-label">Price Standard Deviation:</th>
          <th className="stat-value">{Math.round(result.std_price * 10000) / 10000}</th>
        </tr>
        <tr>
          <th className="stat-label">Total Items:</th>
          <th className="stat-value">{result.total_count}</th>
        </tr>
      </tbody>
    </table>
  );
  const product_stats = (
    <table>
      <tbody>
        <tr>
          <th className="stat-label">Num Matching Products:</th>
          <th className="stat-value">{result.prod_count}</th>
        </tr>
        <tr>
          <th className="stat-label">Product Average Price:</th>
          <th className="stat-value">{formatPrice(result.prod_avg_price)}</th>
        </tr>
      </tbody>
    </table>
  );
  return (
    <Card title={result.store_name} style={{ margin: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Store Statistics:</h3>
      {store_stats}
      <h3>Product Statistics:</h3>
      {product_stats}
      <h3>Price Distribution:</h3>
      <Chart
        type="bar"
        data={{
          labels: result.bucket_labels.map((bucket) => `${formatPrice(bucket.start)} - ${formatPrice(bucket.end)}`),
          datasets: [{ label: result.store_name, data: result.buckets }],
        }}
      />
    </Card>
  );
}

export default function StatSearch({ stores, page_props: { toast }, foodgroups, refetchMeta }: SearchMetadata) {
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
  const [searchResults, setSearchResults] = useState<StatResults | undefined>();

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
      .post_search_stats(searchString)
      .then((results) => {
        if (!results) return navigate('/login');
        setSearchResults(results);
      })
      .catch((error) => {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Failed to execute statistic search',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => setLoading(false));
  }

  const results = (
    <div style={{ opacity: searchResults ? 1 : 0, transition: 'opacity 0.2s' }}>
      {searchResults?.length === 0 ? (
        <p>No Results Found</p>
      ) : (
        <>{searchResults?.map((result) => <StatDisplay key={result.store_id} result={result} />)}</>
      )}
    </div>
  );

  const search_bar = (
    <form style={{ width: '100%', display: 'flex', marginBottom: '2rem' }}>
      <InputText
        placeholder="Search Query"
        disabled={loading}
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
