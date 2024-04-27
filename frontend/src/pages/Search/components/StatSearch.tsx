import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import { SearchMetadata } from '../Search';
import api from '../../../api/api';
import { StatResult, StatResults } from '../../../api/post_search_stats';
import formatPrice from '../../../utils/format_price';

import './statsearch.css';

function StatDisplay({ result }: { result: StatResult }) {
  return (
    <Card title={result.store_name} style={{ margin: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Store Statistics:</h3>
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
      <h3>Product Statistics:</h3>
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
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

    setSearchResults(undefined);
    setLoading(true);
    setShowResults(false);
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
          summary: 'Failed to fetch account',
          detail: `${error.message}. Try again later`,
        });
      })
      .finally(() => {
        setLoading(false);
        setShowResults(true);
      });
  }

  let chart = <></>;
  if (searchResults) {
    if (searchResults.length === 0) {
      chart = <p>No Results Found</p>;
    } else {
      chart = (
        <>
          {searchResults.map((result) => (
            <StatDisplay key={result.store_id} result={result} />
          ))}
        </>
      );
    }
  }

  return (
    <>
      <form style={{ width: '100%', display: 'flex', marginBottom: '2rem' }}>
        <InputText
          disabled={loading}
          value={searchString}
          onChange={(e) => {
            setShowResults(false);
            setSearchString(e.target.value);
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
      <div id="stat-results">
        <div id="stat-loading" style={{ opacity: loading ? 0.5 : 0, pointerEvents: loading ? 'all' : 'none' }}>
          <div>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'white' }}></i>{' '}
          </div>
        </div>
        <div style={{ opacity: showResults ? 1 : 0, transition: showResults ? '' : 'opacity 0.2s' }}>{chart}</div>
      </div>
    </>
  );
}
