import { DataTable } from 'primereact/datatable';
import { PageProps } from '../../../Pages';
import { convertTimestamp } from '../../../utils/convert_date';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../../api/api';
import { History } from '../../../api/get_history';

export default function HistoryView({ toast }: PageProps) {
  const navigate = useNavigate();
  const [history, setHistory] = useState<History | undefined>(undefined);

  // Grab history on first load
  useEffect(() => {
    api
      .get_history()
      .then((h) => {
        if (!h) return navigate('/login');
        setHistory(h);
      })
      .catch((error) => {
        // notify user of error
        setHistory([]);
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message, detail: 'Try again later' });
      });
  }, []);

  return (
    <DataTable value={history} loading={history === undefined} emptyMessage="No History" style={{ minHeight: '10rem' }}>
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
