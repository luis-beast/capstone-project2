import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import LoggedInContext from "../../LoggedInContext";
import "./wiki.css";
import parse from "html-react-parser";

const WikiPage = () => {
  const { id, edit_id } = useParams(); //If edit_id is defined, we are viewing a past version of the page.
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const loggedIn = useContext(LoggedInContext);
  const { state } = useLocation();
  const [innovation, setInnovation] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (state?.page && state.page.id === id) {
      //cached version of the page passed in via state
      setPage(state.page);
    } else if (edit_id) {
      fetch(`http://localhost:8080/pages/${id}/history/${edit_id}`)
        .then((res) => res.json()) //TODO - handle 404s, throw errors if page not found
        .then((data) => {
          if (data.length) {
            let title = `${data[0]?.created_at}::${data[0]?.title}`;
            setPage({ ...data[0], title: title });
            checkInnovation(data[0]);
          } else {
            throw new Error(data.message);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      fetch(`http://localhost:8080/pages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 1) {
            setPage(data[0]);
            checkInnovation(data[0]);
          } else {
            throw new Error(data.message ? data.message : "Page not found");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id, state, edit_id]);

  const PastVersionMessage = () => {
    return (
      <p>
        You are viewing a past version of this article.
        <Link to={`/page/${page.page_id}`}>View current version</Link>
      </p>
    );
  };

  const MessageBox = ({ type, header, text }) => {
    return (
      <div className={`message-box ${type}-message`}>
        <h2>{header}</h2>
        {text}
      </div>
    );
  };

  const checkInnovation = (page) => {
    if (page.tags?.find((tag) => tag.name === "Innovation")) {
      setInnovation(true);
    }
  };

  return (
    <div className="wiki-page">
      {page.id ? (
        <>
          {innovation && (
            <MessageBox
              type="innovation"
              header="Innovation Project"
              text={
                <p>
                  This is an ongoing innovation project meant to change the Air
                  Force for the better, increase our capabilities, and/or
                  improve the lives and work of our personnel. It has not yet
                  been implemented and may or may not be implemented in the
                  future.
                </p>
              }
            />
          )}
          {edit_id && (
            <MessageBox
              type="past-version"
              header="Past version of Project"
              text={<PastVersionMessage />}
            />
          )}
          <h1>{page.title}</h1>
          {loggedIn && (
            <Link to={`page/${id}/edit`}>
              <button className="edit-button">Edit</button>
            </Link>
          )}
          <div className="button-container">
            <Link to={`/page/${id}/history`}>
              <button>View History</button>
            </Link>
            <Link to={`/page/${id}/edit`}>
              {" "}
              <button>Edit Page</button>
            </Link>
          </div>
          <div className="wiki-page-text">
            <article>{parse(page.body)}</article>
          </div>
          {edit_id && page.email && <div>Edit by {page.email}</div>}
        </>
      ) : (
        <p>{loading ? "loading" : "ERROR: page not found"}</p>
      )}
    </div>
  );
};

export default WikiPage;
