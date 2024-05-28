import { useQuery } from 'react-query';
import axios from './main';
import { config } from './config';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { isEmpty, omitBy } from 'lodash';
import Select from 'react-select';

interface Response {
  count: number;
  next: string | undefined;
  previous: string | undefined;
  results: Book[];
}

interface Book {
  id: number;
  title: string;
  subjects: string[];
  authors: Person[];
  translators: Person[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | undefined;
  media_type: string;
  formats: Format;
  download_count: number;
}

interface Person {
  name: string;
  birth_year: number | undefined;
  death_year: number | undefined;
}

interface Format {
  [key: string]: string;
}

// type Option = {
//   value: string;
//   label: string;
// };

const sortOptions = [
  { value: 'ascending', label: 'Ascending by ID' },
  { value: 'descending', label: 'Descending by ID' },
  { value: 'popular', label: 'Most to least popular' },
];

const languagesOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'fi', label: 'Finnish' },
  { value: 'de', label: 'German' },
];

/**
 * @remark
 * Snake case used because URLSearchParams will use the exact given key
 * and the API requires snake case
 */
interface QueryParams {
  search: string | null;
  author_year_start: string | null;
  author_year_end: string | null;
  copyright: string | null;
  languages: string | null;
  sort: string | null;
  topic: string | null;
}

const getResults = async (params: QueryParams) => {
  const queryParams = new URLSearchParams(omitBy(params, isEmpty)).toString();
  return (await axios.get<Response>(`${config.apiURL}/books?${queryParams}`)).data;
};

function setParam(key: string, value: string, searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  console.log(value);
  searchParams.set(key, value);
  setSearchParams(searchParams, { replace: true });
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search');
  const authorYearStart = searchParams.get('author_year_start');
  const authorYearEnd = searchParams.get('author_year_end');
  const copyright = searchParams.get('copyright');
  const topic = searchParams.get('topic');
  const sort = searchParams.get('sort');
  const languages = searchParams.get('languages');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['get-results'],
    queryFn: async () =>
      getResults({
        search,
        author_year_start: authorYearStart,
        author_year_end: authorYearEnd,
        copyright,
        languages,
        sort,
        topic,
      }),
    enabled: false,
  });

  return (
    <div className="w-full flex align-center flex-col">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
      <div className="flex">
        <div>Title</div>
        <input type="search" value={search ?? ''} onChange={(e) => setParam('search', e.target.value, searchParams, setSearchParams)} />

        <div>Topic</div>
        <input type="search" value={topic ?? ''} onChange={(e) => setParam('topic', e.target.value, searchParams, setSearchParams)} />

        <div>Author year start</div>
        <input
          type="number"
          value={authorYearStart ?? ''}
          onChange={(e) => setParam('author_year_start', e.target.value, searchParams, setSearchParams)}
        />

        <div>Author year end</div>
        <input type="number" value="false" onChange={(e) => setParam('author_year_end', e.target.value, searchParams, setSearchParams)} />
      </div>

      <label>
        <input type="checkbox" onChange={(e) => setParam('copyright', String(e.target.checked), searchParams, setSearchParams)} />
        Copyright
      </label>

      <Select
        placeholder="Sort by"
        defaultValue={sortOptions.find((option) => (sort ? option.value === sort : option.value === 'popular'))}
        options={sortOptions}
        onChange={(option) => {
          if (option) setParam('sort', option.value, searchParams, setSearchParams);
        }}
      />

      <Select
        placeholder="Select languages"
        isMulti
        defaultValue={languages?.split(',').map((language) => languagesOptions.find((option) => option.value === language)) ?? []}
        options={languagesOptions}
        onChange={(selectedOptions) => {
          setParam('languages', selectedOptions.map((option) => option?.value).join(','), searchParams, setSearchParams);
        }}
      />

      <button
        onClick={() => {
          refetch();
        }}
        className="w-10"
      >
        Search
      </button>

      {data &&
        data.results.map((book) => {
          return (
            <div>
              {book.title} by{' '}
              {book.authors.map((author) => (
                <div>{author.name}</div>
              ))}{' '}
              downloaded {book.download_count} times
            </div>
          );
        })}
    </div>
  );
}
