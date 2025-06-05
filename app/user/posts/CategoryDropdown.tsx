import { useFiltered } from "./FilterContext";

export default function CategoryDropdown() {
  const { category, setCategory } = useFiltered();

  return (
    <div className="bg-[#d9ebff] rounded-xl p-3 flex flex-col space-y-2 w-full max-w-sm mx-auto shadow-md">
      <label htmlFor="category" className="text-black font-medium text-sm">
        Category:
      </label>
      <select
        id="category"
        className="text-black bg-white w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["None", "Cycling", "Roadworks", "Parks", "Other"].map((option) => (
          <option key={option} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
