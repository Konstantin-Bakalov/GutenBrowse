import { Card } from './card';
import { Response } from './types';
import { v4 as uuidv4 } from 'uuid';

interface BooksGridProps {
  data: Response | undefined;
  onSubjectClicked: (subject: string) => void;
}

export function BooksGrid({ data, onSubjectClicked }: BooksGridProps) {
  return (
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
        {data?.results.map((book) => <Card book={book} key={uuidv4()} onSubjectClicked={(subject: string) => onSubjectClicked(subject)} />)}
      </div>
    </>
  );
}
