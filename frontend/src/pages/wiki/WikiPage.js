import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import LoggedInContext from "../../LoggedInContext";
import "./wiki.css";

const WikiPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const loggedIn = useContext(LoggedInContext);
  const { state } = useLocation();
  const [innovation, setInnovation] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (state?.page) {
      setPage(state.page);
    } else {
      fetch(`http://localhost:8080/pages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPage(data[0]);
          checkInnovation(data[0]);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id, state]);

  //TODO - why isn't this working?
  const checkInnovation = (page) => {
    if (page.tags.find((tag) => "Innovation" === tag.name)) {
      setInnovation(true);
    }
  };

  return (
    <div className="wiki-page">
      {innovation && (
        <p className="inn-box">
          This is an innovation that can help you better your work life! Check
          it out!
        </p>
      )}
      {state?.pastVersion && (
        <div className="past-version-box">
          <p>You are currently viewing a past version of this article.</p>
        </div>
      )}
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
