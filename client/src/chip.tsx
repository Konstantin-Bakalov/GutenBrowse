interface ChipProps {
  text: string;
  onClick: () => void;
}

export function Chip({ text, onClick }: ChipProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
      <button
        className="middle disabled none center mr-4 rounded-full bg-emerald-500 py-2 px-3 text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-gray-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        data-ripple-light="true"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
