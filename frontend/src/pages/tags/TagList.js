import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      })
      .catch((err) => console.log(err))
      .finally(setLoading(false));
  }, []);

  return (
    <>
      <h1>Search tags by name</h1>
      <input
        type="search"
        placeholder="Search tags..."
        onChange={handleChange}
        value={searchInput}
      />

      {tags
        .filter((tag) =>
          tag.name.toLowerCase().includes(searchInput.toLowerCase())
        )
        .map((tag, index) => (
          <p key={index}>
            <Link to={`/search`} state={{ initialSearch: `tag:${tag.name}` }}>
              {tag.name}
            </Link>
          </p>
        ))}
    </>
  );
};

export default TagList;
