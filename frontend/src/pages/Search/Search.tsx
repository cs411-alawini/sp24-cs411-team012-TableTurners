import { PageProps } from '../../Pages';

function Search({ toast, profile }: PageProps) {
  if (!profile) return <></>;

  return (
    <>
      <h1>Search</h1>
    </>
  );
}

export default Search;
