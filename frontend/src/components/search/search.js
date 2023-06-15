import { useState } from "react";

function Search() {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search for a wikipage..."
        onChange={handleChange}
        value={searchInput}
      />
      <button>Search</button>
    </div>
  );
}

export default Search;
