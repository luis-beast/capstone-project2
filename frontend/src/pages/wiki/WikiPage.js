import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import LoggedInContext from "../../LoggedInContext";

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
          showInnovation();
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id, state]);

  const checkInnovation = (page, searchTerms) => {
    const termArray = searchTerms.split(" ");
    for (let i = 0; i < termArray.length; i++) {
      let term = termArray[i];
      if (term?.includes("tag:")) {
        let searchTag = term.split(":")[1];
        if (!page.tags?.find((tag) => tag.name === searchTag)) {
          setInnovation(false);
        }
      } else {
        if (!page.body?.includes("Innovation")) {
          setInnovation(false);
        }
      }
    }
    setInnovation(true);
  };

  const showInnovation = () => {
    setInnovation(true);
  };

  return (
    <div className="wiki-page">
      {innovation && (
        <div>
          {" "}
          type="text" value="This is an innovation that can help you better your
          work life! Check it out!"{" "}
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
