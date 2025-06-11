import { useFiltered } from "./FilterContext";

export default function CategoryDropdown() {
  const { category, setCategory } = useFiltered();

  return (
    <div className="bg-[#d9ebff] rounded-xl p-2 flex flex-row items-center space-x-2 w-full h-10 shadow-md">
      <label htmlFor="category" className="text-black font-medium text-sm whitespace-nowrap">
        Category:
      </label>
      <select
        id="category"
        className="text-black bg-white w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["None", "Cycling", "Roadworks", "Parks", "Other"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}