import axios from './main';
import { config } from './config';
import { useSearchParams } from 'react-router-dom';
import { isEmpty, omitBy } from 'lodash';
// import Select from 'react-select';
import { useMutation } from 'react-query';
import { QueryParams, Response } from './types';
import { Header } from './header';
import { SearchFields, setParam } from './search-fields';
import { BooksGrid } from './books-grip';

/**
 * @remark
 * Gutendex API always gives up to 32 items per page
 * This cannot be configured
 */
// const ITEMS_PER_PAGE = 32;

const getResponse = async (params: QueryParams) => {
  const queryParams = new URLSearchParams(omitBy(params, isEmpty)).toString();
  return (await axios.get<Response>(`${config.apiURL}/books?${queryParams}`)).data;
};

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
    mutationFn: async (params: QueryParams) => getResponse(params),
  });

  // const pageNumber = data?.count ? Math.ceil(data?.count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="w-full h-full flex flex-col px-6 bg-slate-100 gap-10">
      <Header />

      <SearchFields
        search={search}
        authorYearEnd={authorYearEnd}
        authorYearStart={authorYearStart}
        copyright={copyright}
        topic={topic}
        sort={sort}
        languages={languages}
        page={page}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSearch={() => {
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
      />

      {/* <div className="self-center">
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
      </div> */}

      {isLoading && <div className="self-center">Loading...</div>}

      {isError && <div className="self-center">Encountered an error</div>}

      {!isLoading && !isError && (
        <BooksGrid
          data={data}
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
      )}
    </div>
  );
}
