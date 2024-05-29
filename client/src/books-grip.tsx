import { Card } from './card';
import { Response } from './types';

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
        {data?.results.map((book, index) => (
          <Card book={book} key={index} onSubjectClicked={(subject: string) => onSubjectClicked(subject)} />
        ))}
      </div>
    </>
  );
}
