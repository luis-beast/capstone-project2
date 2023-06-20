import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return;
  <div>
    <ul>
      {tags.map((tag, index) => (
        <li key="index">
          <Link to={`/search`} state={{ initialSearch: `tag:${tag.name}` }}>
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>;
};

export default TagList;
