interface PaginationProps {
  page: string | null;
  numberOfPages: number;
  setPage: (newPage: string) => void;
  onSubmit: () => void;
}

export function Pagination({ page, numberOfPages, setPage, onSubmit }: PaginationProps) {
  return (
    <div className="self-center flex gap-3">
      <button className="rounded-lg bg-emerald-500 px-3" onClick={() => onSubmit()}>
        Go to page
      </button>
      <input type="number" value={page ?? ''} onChange={(e) => setPage(e.target.value)} className="w-14" /> of {numberOfPages}
    </div>
  );
}
