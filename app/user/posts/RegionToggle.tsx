import { useFiltered } from "./FilterContext";

export default function FilterToggle() {
  const { filtered, setFiltered } = useFiltered();

  return (
    <button
      className={`h-10 w-full rounded-lg p-2 text-black font-medium text-sm transition-all duration-150 ease-out active:scale-95 shadow-md hover:shadow-lg border border-transparent
        ${filtered ? 'bg-[#b8d6f5] hover:bg-[#a5c6ea]' : 'bg-[#d9ebff] hover:bg-[#c2defc]'}`}
      onClick={() => setFiltered(!filtered)}
    >
      {!filtered ? "Just my region" : "All posts"}
    </button>
  );
}