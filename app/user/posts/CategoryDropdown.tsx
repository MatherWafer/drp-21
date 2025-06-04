import { useCategory } from "./CategoryContext";

export default function CategoryDropdown() {
  const { category, setCategory } = useCategory();

  return (
    <div className="mb-8">
      <label>Filter by category: </label>
      <select
        id="category"
        className="w-half p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {["None", "Cycling", "Roadworks", "Parks", "Other"].map((option) => (
          <option
            key={option}
            value={option}
            style={{ backgroundColor: "black", color: "white" }}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}