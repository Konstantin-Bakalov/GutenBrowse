import { isEmpty } from 'lodash';
import { SetURLSearchParams } from 'react-router-dom';
import Select from 'react-select';

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

export function setParam(key: string, value: string, searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  if (isEmpty(value)) {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  setSearchParams(searchParams, { replace: true });
}

interface SearchFieldsProps {
  search: string | null;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  authorYearStart: string | null;
  authorYearEnd: string | null;
  copyright: string | null;
  topic: string | null;
  sort: string | null;
  languages: string | null;
  onSearch: () => void;
}

export function SearchFields({
  search,
  authorYearStart,
  authorYearEnd,
  copyright,
  topic,
  sort,
  languages,
  searchParams,
  setSearchParams,
  onSearch,
}: SearchFieldsProps) {
  return (
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
            onClick={() => onSearch()}
            className="self-center w-full middle none center rounded-lg bg-emerald-500 py-2 px-4 font-sans text-bold font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
