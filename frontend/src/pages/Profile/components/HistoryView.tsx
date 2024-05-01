import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import api from '../../../api/api';
import { History } from '../../../api/get_history';
import { PageProps } from '../../../Pages';
import { convertTimestamp } from '../../../utils/convert_timestamp';

export default function HistoryView({ toast }: PageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<History | undefined>(undefined);

  // Handles fetching history and notifying on error
  function loadHistory() {
    setLoading(true);
    api
      .get_history()
      .then((h) => {
        // Redirect to login if undefined (unauthorized)
        if (!h) return navigate('/login');
        setHistory(h);
      })
      .catch((error) => {
        // notify user of error
        setHistory(undefined);
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message, detail: 'Try again later' });
      })
      .finally(() => setLoading(false));
  }
  // Load history on first load
  useEffect(loadHistory, []);

  // If loaded but history is empty array, show no history message
  let message = <div style={{ minHeight: '20rem' }}>No History</div>;
  // Show error if finished loading, but history still undefined (failure to load)
  if (!loading && history === undefined) {
    message = (
      <div style={{ minHeight: '20rem' }}>
        <p>Failed to fetch history. Try again later.</p>
        <Button onClick={loadHistory} icon={PrimeIcons.REFRESH}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <DataTable
      value={history}
      loading={loading}
      emptyMessage={message}
      style={{ minHeight: '20rem' }}
      paginator
      rows={25}
      rowsPerPageOptions={[25, 50, 100]}
    >
      <Column
        field="search_string"
        header="Search"
        style={{ width: '75%' }}
        sortable
        body={(h) => <p style={{ overflowWrap: 'anywhere' }}>{h.search_string}</p>}
      />
      <Column
        field="timestamp"
        header="Timestamp"
        sortable
        style={{ width: '25%' }}
        body={(h) => convertTimestamp(h.timestamp)}
      />
    </DataTable>
  );
}
