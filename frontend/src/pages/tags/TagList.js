import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.js";

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
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
      <Navbar />
      <h1>Search by a tag name...</h1>
      <input
        type="search"
        placeholder="Search by tag..."
        onChange={handleChange}
        value={searchInput}
      />
      <button>Search</button>
      {tags.map((tag, index) => (
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
