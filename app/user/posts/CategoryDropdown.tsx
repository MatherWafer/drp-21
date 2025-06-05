import { useCategory } from "./CategoryContext";

export default function CategoryDropdown() {
  const { category, setCategory } = useCategory();

  return (
    <div className="bg-[#d9ebff] rounded-lg p-1">
      <label className="text-black">Filter by category: </label>
      <select
        id="category"
        className="text-black w-half border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["None", "Cycling", "Roadworks", "Parks", "Other"].map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#d9ebff] color-black"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}