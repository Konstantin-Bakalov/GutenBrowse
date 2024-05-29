import axios from './main';
import { config } from './config';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { isEmpty, omitBy } from 'lodash';
import Select from 'react-select';
import { Card } from './card';
import { useMutation } from 'react-query';

const ITEMS_PER_PAGE = 32;

interface Response {
  count: number;
  next: string | undefined;
  previous: string | undefined;
  results: Book[];
}

export interface Book {
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

const sortOptions = [
  { value: 'ascending', label: 'Ascending by ID' },
  { value: 'descending', label: 'Descending by ID' },
  { value: 'popular', label: 'Most to least popular' },
];

export const languagesMap = new Map<string, string>([
  ['en', 'English'],
  ['fr', 'French'],
  ['fi', 'Finnish'],
  ['de', 'German'],
]);

const languagesOptions = Array.from(languagesMap.entries()).map((entry) => {
  return { value: entry[0], label: entry[1] };
});

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
  page: string;
}

const getResults = async (params: QueryParams) => {
  const queryParams = new URLSearchParams(omitBy(params, isEmpty)).toString();
  return (await axios.get<Response>(`${config.apiURL}/books?${queryParams}`)).data;
};

function setParam(key: string, value: string, searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
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
  const page = searchParams.get('page') ?? '1';

  const { data, mutate, isLoading, isError } = useMutation({
    mutationKey: ['mutation', searchParams],
    mutationFn: async (params: QueryParams) => getResults(params),
  });

  const pageNumber = data?.count ? Math.ceil(data?.count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="w-full h-full flex flex-col px-6 bg-slate-100 gap-10">
      <div className="max-w-screen-lg self-center py-4">
        <div className="flex flex-col sm:flex-row gap-7 w-full justify-center">
          <h2 className="font-bold text-center text-6xl text-slate-700 font-display">GutenBrowse</h2>
        </div>
        <p className="text-center mt-4 font-medium text-slate-500">Explore the Gutendex Library</p>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-3">
          <div className="flex flex-col gap-3 sm:w-full xl:w-2/6">
            <div className="flex w-full border-2 border-slate-700 rounded bg-white">
              <input
                type="search"
                placeholder="Search in title"
                value={search ?? ''}
                onChange={(e) => setParam('search', e.target.value, searchParams, setSearchParams)}
                className="w-full outline-none bg-transparent px-4 py-1 text-zinc-500"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex border-2 flex-grow border-slate-700 rounded bg-white">
                <input
                  type="number"
                  placeholder="Author year start"
                  value={authorYearStart ?? ''}
                  onChange={(e) => setParam('author_year_start', e.target.value, searchParams, setSearchParams)}
                  className="w-full outline-none bg-transparent px-4 py-1 text-zinc-500"
                />
              </div>

              <div className="flex border-2 flex-grow border-slate-700 rounded bg-white">
                <input
                  type="number"
                  placeholder="Author year end"
                  value={authorYearEnd ?? ''}
                  onChange={(e) => setParam('author_year_end', e.target.value, searchParams, setSearchParams)}
                  className="w-full outline-none bg-transparent px-4 py-1 text-zinc-500"
                />
              </div>
            </div>

            <div className="flex w-full border-2 border-slate-700 rounded bg-white">
              <input
                type="search"
                placeholder="Search by topic"
                value={topic ?? ''}
                onChange={(e) => setParam('topic', e.target.value, searchParams, setSearchParams)}
                className="w-full outline-none bg-transparent px-4 py-1 text-zinc-500"
              />
            </div>

            <Select
              placeholder="Select languages"
              isMulti
              defaultValue={languages?.split(',').map((language) => languagesOptions.find((option) => option.value === language)) ?? []}
              options={languagesOptions}
              onChange={(selectedOptions) => {
                setParam('languages', selectedOptions.map((option) => option?.value).join(','), searchParams, setSearchParams);
              }}
            />

            <Select
              placeholder="Sort by"
              defaultValue={sortOptions.find((option) => (sort ? option.value === sort : option.value === 'popular'))}
              options={sortOptions}
              onChange={(option) => {
                if (option) setParam('sort', option.value, searchParams, setSearchParams);
              }}
            />

            <label className="self-center flex gap-1">
              <input
                type="checkbox"
                checked={copyright === 'true' ? true : false}
                onChange={(e) => setParam('copyright', String(e.target.checked), searchParams, setSearchParams)}
              />
              Books with existing copyrights
            </label>

            <button
              onClick={() => {
                setParam('page', '1', searchParams, setSearchParams);
                mutate({
                  search,
                  author_year_start: authorYearStart,
                  author_year_end: authorYearEnd,
                  copyright,
                  languages,
                  sort,
                  topic,
                  page: String(page),
                });
              }}
              className="self-center w-full middle none center rounded-lg bg-emerald-500 py-2 px-4 font-sans text-bold font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="self-center">
        {data?.count === 0 && <div>No books were found</div>}
        {data?.count && data?.count > 0 && <div>{data.count} books were found</div>}
        {pageNumber > 1 && (
          <Select
            placeholder="Select a page"
            value={{ value: searchParams.get('page'), label: `Page ${searchParams.get('page')}` }}
            options={Array.from(Array(pageNumber + 1).keys())
              .slice(1)
              .map((n) => {
                return { value: String(n), label: `Page ${n}` };
              })}
            onChange={(option) => {
              setParam('page', String(option?.value), searchParams, setSearchParams);

              mutate({
                search,
                author_year_start: authorYearStart,
                author_year_end: authorYearEnd,
                copyright,
                languages,
                sort,
                topic,
                page: String(option?.value),
              });
            }}
          />
        )}
      </div>

      {isLoading && <div className="self-center">Loading...</div>}

      {isError && <div className="self-center">Encountered an error</div>}

      {!isLoading && !isError && (
        <>
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              columnGap: 20,
              rowGap: 20,
              gridAutoRows: '1fr',
              alignItems: 'flex-start',
            }}
          >
            {data?.results.map((book, index) => (
              <Card
                book={book}
                key={index}
                onSubjectClicked={(subject: string) => {
                  setParam('search', '', searchParams, setSearchParams);
                  setParam('author_year_start', '', searchParams, setSearchParams);
                  setParam('author_year_end', '', searchParams, setSearchParams);
                  setParam('copyright', '', searchParams, setSearchParams);
                  setParam('languages', '', searchParams, setSearchParams);
                  setParam('sort', '', searchParams, setSearchParams);
                  setParam('topic', subject, searchParams, setSearchParams);
                  setParam('page', '1', searchParams, setSearchParams);

                  mutate({
                    search,
                    author_year_start: authorYearStart,
                    author_year_end: authorYearEnd,
                    copyright,
                    languages,
                    sort,
                    topic: subject,
                    page: '1',
                  });
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
