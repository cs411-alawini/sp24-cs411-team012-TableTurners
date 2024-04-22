import { TabPanel, TabView } from 'primereact/tabview';
import { PageProps } from '../../Pages';
import KeywordSearch from './components/KeywordSearch';
import BudgetSearch from './components/BudgetSearch';

function Search({ toast, profile }: PageProps) {
  if (!profile) return <></>;

  return (
    <>
      <h1>Search</h1>
      <TabView>
        <TabPanel header="Keyword Search">
          <KeywordSearch />
        </TabPanel>
        <TabPanel header="Search with Budget">
          <BudgetSearch />
        </TabPanel>
      </TabView>
    </>
  );
}

export default Search;
