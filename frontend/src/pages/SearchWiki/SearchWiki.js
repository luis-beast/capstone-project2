import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function ellipsify(str) {
  if (str.length > 10) {
    return str.substring(0, 30) + "...";
  } else {
    return str;
  }
}

const SearchItem = ({ page }) => {
  return (
    <div className="search-item-container">
      <div className="search-item">
        <Link to={`/page/${page.id}`} state={{ page: page }}>
          <h3>{page.title}</h3>
          <p>{ellipsify(`${page.body}`)}</p>
          {page.tags.map((tag, index) => (
            <li>{tag.name}</li>
          ))}
        </Link>
      </div>
    </div>
  );
};

const SearchWiki = () => {
  const { state } = useLocation();
  const [pageList, setPageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );
  const [searchInput, setSearchInput] = useState(
    state?.initialSearch ? state.initialSearch : ""
  );

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/pages")
      .then((res) => res.json())
      .then((data) => setPageList(data))
      .catch((err) => console.log(err))
      .finally(setLoading(false));
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setSearch("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearch(searchInput);
    setLoading(false);
  };

  const matchesSearchInput = (page, searchTerms) => {
    const termArray = searchTerms.split(" ");
    for (let i = 0; i < termArray.length; i++) {
      let term = termArray[i];
      if (term?.includes("tag:")) {
        let searchTag = term.split(":")[1];
        if (!page.tags?.find((tag) => tag.name === searchTag)) {
          return false;
        }
      } else {
        if (!(page.title.includes(term) || page.body?.includes(term))) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="search-wiki-page">
      <div className="search-bar">
        <p>Search by keywords, or by tags with "tag:[tagname]"</p>
        <input
          type="text"
          value={searchInput}
          onChange={handleChange}
          placeholder="Search"
        />
        <button className="search" onClick={handleSearch}>
          Search{" "}
        </button>
      </div>
      {pageList
        .filter((page) => matchesSearchInput(page, search))
        .map((page, index) => {
          return <SearchItem page={page} key={index} />;
        })}
      <h5>Can't find what you're looking for?</h5>
      <Link to="/add-wiki">
        <button className="create-button">Create Article</button>
      </Link>
    </div>
  );
};

export default SearchWiki;
