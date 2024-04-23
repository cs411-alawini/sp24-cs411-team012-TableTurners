import { DataTable } from 'primereact/datatable';
import { PageProps } from '../../../Pages';
import { convertTimestamp } from '../../../utils/convert_timestamp';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../../api/api';
import { History } from '../../../api/get_history';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

export default function HistoryView({ toast }: PageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<History | undefined>(undefined);

  function loadHistory() {
    setLoading(true);
    api
      .get_history()
      .then((h) => {
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
  useEffect(loadHistory, []);

  let message = <div style={{ minHeight: '20rem' }}>No History</div>;
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
    <DataTable value={history} loading={loading} emptyMessage={message} style={{ minHeight: '20rem' }}>
      <Column field="search_string" header="Search" sortable />
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
