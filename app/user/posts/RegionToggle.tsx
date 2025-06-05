import { useFiltered } from "./FilterContext";

export default function FilterToggle() {
  const { filtered, setFiltered } = useFiltered();

  return (
    <div className="bg-[#d9ebff] rounded-lg p-1">
      <label className="text-black">Hide posts out my region: </label>
      <input type='checkbox' onChange={(e) => setFiltered(!filtered)}></input>
    </div>
  );
}