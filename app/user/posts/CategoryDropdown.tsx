import { Dispatch, SetStateAction } from "react";
import PostOverview, { PostInfo } from "./PostOverview";

export default function FilterDropdown(props:{setFunc: Dispatch<SetStateAction<string>>, category: string}) {
  return <div className="mb-8">
          <label>Filter by category:   </label>
          <select id="category"
            className="w-half p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={props.category}
            onChange={(e) => props.setFunc(e.target.value)}
          >
            <option value="None">
              None
            </option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Cycling">Cycling</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Roadworks">Roadworks</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Parks">Parks</option>
            <option style={{backgroundColor: 'black', color: 'white'}} value="Other">Other</option>
          </select>
        </div>
}