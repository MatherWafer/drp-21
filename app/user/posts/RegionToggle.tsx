import { useFiltered } from "./FilterContext";

export default function FilterToggle() {
  const { filtered, setFiltered } = useFiltered();

  return (
    <button
    className={`w-1/2 rounded-lg p-2 text-black font-medium text-sm transition-all duration-150 ease-out active:scale-95 shadow-md hover:shadow-lg
        ${filtered ? 'bg-[#b8d6f5] hover:bg-[#a5c6ea]' : 'bg-[#d9ebff] hover:bg-[#c2defc]'}`}
    onClick={() => setFiltered(!filtered)}
    >
    {!filtered ? "Show posts only in" : "Include posts outside of"} my region
    </button>


  );
}