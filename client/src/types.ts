/**
 * @remark
 * Snake case used because URLSearchParams will use the exact given key
 * and the API requires snake case
 */

export interface Response {
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

export interface QueryParams {
  search: string | null;
  author_year_start: string | null;
  author_year_end: string | null;
  copyright: string | null;
  languages: string | null;
  sort: string | null;
  topic: string | null;
  page: string;
}
