import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

import { SearchMetadata } from '../Search';
import api from '../../../api/api';
import { keywordSearch } from '../../../api/post_search';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';




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
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState<keywordSearch | undefined>();

  function loadKeywordSearchResult() {
    setSearchResults(undefined);
    setLoading(true);
    setShowResults(false);
    api
      .post_search(searchString)
      .then((h) => {
        if (!h) return navigate('/login');
        setSearchResults(h);
      })
      .catch((error) => {
        // notify user of error
        setSearchResults(undefined);
        console.error(error);
        toast.current?.show({ severity: 'error', summary: error.message, detail: 'Try again later' });
      })
      .finally(() => {
        setLoading(false);
        setSearchResults(searchResults);
        setShowResults(true);
      });
       
  }
  // useEffect(KeywordSearchDisplay, [stores, p]);

  let message = <div style={{ minHeight: '20rem' }}>No result</div>;
  if (!loading && searchResults === undefined) {
    message = (
      <div style={{ minHeight: '20rem' }}>
        <p>Failed to fetch results.. Try again later.</p>
        <Button onClick={loadKeywordSearchResult} icon={PrimeIcons.REFRESH}>
          Retry
        </Button>
      </div>
    );
  }

  
  interface searchResults {
    store_name: string;
    name: string;
    price: number;
  }

  const safeResults = searchResults || [];

  interface InputType {
    id: number;
    name: string;
    price: number;
  }
  
  interface OutputType {
    productId: number;
    productName: string;
    productPrice: number;
  }

  const convertToObject = (searchResults: InputType): OutputType => {
    return {
      productId:searchResults.id,
      productName: searchResults.name,
      productPrice: searchResults.price
    };
  };

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
            loadKeywordSearchResult();
            e.preventDefault();
          }}
        >
          Search
        </Button>
        </form>
        <div>
          
         
          </div>
    
      
   </>
  );
}
