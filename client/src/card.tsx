import { Chip } from './chip';
import { languagesMap } from './search-fields';
import { Book } from './types';
import { v4 as uuidv4 } from 'uuid';

interface CardProps {
  book: Book;
  onSubjectClicked: (subject: string) => void;
}

export function Card({ book, onSubjectClicked }: CardProps) {
  return (
    <div className="h-full self-stretch m-auto shadow rounded-lg flex flex-col gap-4 w-full py-6 px-4 bg-slate-300">
      <img src={book.formats['image/jpeg']} className="h-72 rounded object-contain object-center" alt="thumbnail" />

      <div className="flex flex-col">
        <h3 className="font-bold text-lg line-clamp-2 text-ellipsis">{book.title}</h3>

        <div className="flex flex-col items-start gap-2.5">
          <div>
            By{' '}
            {book.authors.map((author) => (
              <span key={uuidv4()}>{author.name} </span>
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <h4 className="line-clamp-1 text-ellipsis">Language: {book.languages.map((language) => languagesMap.get(language)).join(', ')}</h4>

        <h4 className="flex gap-1 items-center">Downloads: {book.download_count}</h4>
      </div>

      <div className="flex gap-1 flex-wrap-reverse mt-auto">
        {book.subjects.map((subject) => (
          <Chip text={subject} key={uuidv4()} onClick={() => onSubjectClicked(subject)} />
        ))}
      </div>
    </div>
  );
}
