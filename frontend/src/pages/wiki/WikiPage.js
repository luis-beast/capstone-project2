import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import LoggedInContext from "../../LoggedInContext";

const WikiPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const loggedIn = useContext(LoggedInContext);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/pages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPage(data[0]);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="wiki-page">
      <h1>{page.title}</h1>
      {loggedIn && (
        <Link to={`pages/${id}/edit`}>
          <button className="edit-button">Edit</button>
        </Link>
      )}
      <div className="wiki-page-text">
        <article>{page.body}</article>
      </div>
    </div>
  );
};

export default WikiPage;
