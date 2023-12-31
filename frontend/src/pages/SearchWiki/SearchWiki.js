import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import parse from "html-react-parser";
import "./SearchWiki.css";
import UserContext from "../../userContext";
import moment from "moment";
import { BiSearch } from "react-icons/bi";

function ellipsify(str) {
  if (str.length > 10) {
    return str.substring(0, 30) + "...";
  } else {
    return str;
  }
}

const SearchItem = ({ page }) => {
  const stringBody = page.body.replace(/<\/?[^>]+(>|$)/g, "");

  return (
    <div className="search-item">
      <Link to={`/page/${page.id}`} state={{ page: page }}>
        <h2 className="page-title">{page.title}</h2>
        <p>{ellipsify(`${stringBody}`)}</p>
        <h3 className="tag-names">Tags</h3>
        {page.tags.map((tag) => (
          <p key={tag.id}>{tag.name}</p>
        ))}
        <h4>
          Last updated @{" "}
          {moment.utc(page.updated_at).format("DD MMM YYYY hh:mm:ss")}
        </h4>
      </Link>
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
  const [userData, setUserData] = useContext(UserContext);
  const possibleSorts = [
    "Recently Edited",
    "Oldest Edits",
    "Title (A-Z)",
    "Title (Z-A)",
  ];
  const [sortBy, setSortBy] = useState("Recently Edited");

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

  const handleSort = (e) => {
    e.preventDefault();
    setSortBy(e.target.value);
  };

  const pageComparator = (a, b) => {
    if (sortBy === "Recently Edited") {
      if (a.updated_at > b.updated_at) {
        return -1;
      } else if (a.updated_at === b.updated_at) {
        return 0;
      } else {
        return 1;
      }
    } else if (sortBy === "Oldest Edits") {
      if (a.updated_at < b.updated_at) {
        return -1;
      } else if (a.updated_at === b.updated_at) {
        return 0;
      } else {
        return 1;
      }
    } else if (sortBy === "Title (A-Z)") {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() === b.title.toLowerCase()) {
        return 0;
      } else {
        return 1;
      }
    } else if (sortBy === "Title (Z-A)") {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() === b.title.toLowerCase()) {
        return 0;
      } else {
        return 1;
      }
    }
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
        if (
          !(
            page.title.toLowerCase().includes(term.toLowerCase()) ||
            page.body?.toLowerCase()?.includes(term.toLowerCase())
          )
        ) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="search-wiki-page">
      <div className="search-bar">
        <h1>Search by keywords</h1>
        <h3>Search for a tag with tag:tagname</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search"
          />
          <button type="submit" className="search-button">
            <BiSearch style={{ position: "relative", top: "3px" }} /> Search{" "}
          </button>
        </form>
        <span>
          Sort By:
          <select
            className="search-wiki-select"
            onChange={handleSort}
            value={sortBy}
          >
            {possibleSorts.map((sort, index) => (
              <option className="dropdown" key={index}>
                {sort}
              </option>
            ))}
          </select>
        </span>
      </div>
      {pageList
        .filter((page) => matchesSearchInput(page, search))
        .sort(pageComparator)
        .map((page, index) => {
          return <SearchItem page={page} key={index} />;
        })}
      {userData.id && (
        <>
          <h5>Can't find what you're looking for?</h5>
          <Link to="/add-wiki">
            <button className="create-button">Create Article</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default SearchWiki;
