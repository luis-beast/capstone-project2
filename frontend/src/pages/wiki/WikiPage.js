import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import UserContext from "../../userContext.js";
import "./wiki.css";
import parse from "html-react-parser";
import moment from "moment";

const WikiPage = () => {
  const { id, edit_id } = useParams(); //If edit_id is defined, we are viewing a past version of the page.
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useContext(UserContext);
  const { state } = useLocation();
  const [innovation, setInnovation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (state?.page && state.page.id === id) {
      //cached version of the page passed in via state
      setPage(state.page);
    } else if (edit_id) {
      fetch(`http://localhost:8080/pages/${id}/history/${edit_id}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 404) {
            throw new Error(`Edit ${edit_id} for page with id ${id} not found`);
          } else {
            throw new Error(`Error ${res.status}`);
          }
        })
        .then((data) => {
          let momentTime = moment
            .utc(data[0]?.created_at)
            .format("DD MMM YYYY hh:mm:ss");
          let title = `${momentTime} :: ${data[0]?.title}`;
          setPage({ ...data[0], title: title });
          checkInnovation(data[0]);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false)); // that did not work
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
        <Link to={`/page/${page.page_id}`}> View current version</Link>
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
    if (page.tags?.find((tag) => tag.name === "innovation")) {
      setInnovation(true);
    }
  };

  const deletePage = (id) => {
    const init = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    };
    fetch(`http://localhost:8080/pages/${id}`, init)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Could not delete wikipage with id: ${id}`);
        }
      })
      .then((data) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleRevert = (e) => {
    e.preventDefault();
    setLoading(true);
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userData.id }),
    };
    fetch(`http://localhost:8080/pages/${id}/revert/${edit_id}`, init)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Unable to revert page ${id} to edit ${edit_id}`);
        }
      })
      .then(() => {
        navigate(`/page/${id}`);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="wiki-page">
      <div className="button-container">
        <div className="mutate-buttons">
          {userData.id && (
            <Link to={`/page/${id}/edit`}>
              <button className="edit-button">Edit</button>
            </Link>
          )}
          {userData.is_admin && (
            <button className="danger" onClick={() => deletePage(page.id)}>
              Delete
            </button>
          )}
        </div>
        <div className="meta-info-buttons">
          <Link to={`/page/${id}/history`}>
            <button>View History</button>
          </Link>
          {!!page.forum_ids?.length && (
            <Link to={`/forum/${page.forum_ids[0]}`}>
              <button>Discuss</button>
            </Link>
          )}
        </div>
      </div>
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
            <>
              <MessageBox
                type="past-version"
                header="Past version of Project"
                text={<PastVersionMessage />}
              />
              {userData.id && (
                <button className="danger revert" onClick={handleRevert}>
                  Revert to this version
                </button>
              )}
            </>
          )}

          <h1>{page.title}</h1>
          <div className="wiki-page-text">
            <article>{parse(page.body)}</article>
          </div>
          {edit_id && page.email && (
            <h3>
              Edit by{" "}
              {userData.is_admin || userData.id === page.user_id ? (
                <Link to={`/user/${page.user_id}/history`}>{page.email}</Link>
              ) : (
                page.email
              )}
            </h3>
          )}
        </>
      ) : (
        <p>{loading ? "loading" : "ERROR: page not found"}</p>
      )}
      <div className="tag-container">
        {!!page?.tags?.length &&
          page.tags.map((tag) => (
            <Link
              to={`/search`}
              key={tag.id}
              state={{ initialSearch: `tag:${tag.name}` }}
            >
              <div className="page-links">{tag.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default WikiPage;
