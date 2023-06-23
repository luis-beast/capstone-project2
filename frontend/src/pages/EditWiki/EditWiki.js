import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditWiki.css";
import useLocalStorageState from "../../useLocalStorageState.js";

//TODO - prevent page from loading if user is not logged in (once we add login support)
const EditWiki = () => {
  const millisecondsToEditPage = 3600000;
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const [editorValue, setEditorValue] = useState("");
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [pageLock, setPageLock] = useLocalStorageState({}, `page${id}lock`);
  const [pageIsLocked, setPageIsLocked] = useState(false);

  useEffect(() => {
    if (
      pageLock.timestamp &&
      pageLock.timestamp + millisecondsToEditPage >= Date.now()
    ) {
      setPageLock({});
      setPageIsLocked(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: pageLock?.id ? JSON.stringify(pageLock) : "",
    };
    fetch(`http://localhost:8080/pages/${id}/edit-request`, init)
      .then((res) => res.json())
      .then((data) => {
        if (data.message.match(/granted/i)) {
          setPageLock(data.lock);
          setPageIsLocked(false);
        } else {
          setPageIsLocked(true);
        }
      })
      .catch((err) => console.log(err));

    if (state?.page && state.page.id === id) {
      //cached version of the page passed in via state
      setPage(state.page);
      setLoading(false);
    } else {
      fetch(`http://localhost:8080/pages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 1) {
            setPage(data[0]);
            setEditorValue(data[0].body);
            setTags(data[0].tags.map((tag) => tag.name));
          } else {
            throw new Error(data.message ? data.message : "Page not found");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id, state]);

  const safeSetComment = (e) => {
    if (e.target.value?.length <= 255) {
      setComment(e.target.value);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const init = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: pageLock?.id ? JSON.stringify(pageLock) : "",
    };
    fetch(`http://localhost:8080/pages/${id}/edit-request`, init)
      .catch((err) => console.log(err))
      .finally(() => {
        navigate(`/page/${id}`);
      });
  };

  const addTags = () => {
    if (newTag.trim()) {
      setTags([...tags, ...newTag.trim().split(" ")]);
      setNewTag("");
    }
  };
  const deleteTags = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const saveChanges = () => {
    setLoading(true);
    const newBody = editorValue;
    const newArticle = {
      id: page.id,
      title: page.title,
      body: newBody,
      comment: comment,
      tags: tags,
      lock: pageLock,
    };
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    };
    fetch(`http://localhost:8080/pages/${id}`, init)
      //Check for 404 erros
      .then((res) => {
        if (res.status == 201) {
          navigate(`/page/${page.id}`, { replace: true });
        } else {
          throw new Error(`${res.status} Error`);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  //use pageIsLocked to show the user a notification that they can't edit the page.
  return (
    <div className="edit-wiki">
      {pageIsLocked ? (
        <>
          <h1>{page.title}</h1>
          <p>
            Someone else is currently editing this page. You may not edit it
            now.
          </p>
          <Link to={`/page/${id}`}>Return to current page version</Link>
        </>
      ) : (
        <>
          <h1>{page.title}</h1>
          <button className="cancel-edit" onClick={handleCancel}>
            Cancel Edits
          </button>
          <div className="edit-box">
            <ReactQuill
              value={editorValue}
              onChange={(value) => {
                setEditorValue(value);
              }}
              placeholder="Text Body"
              theme="snow"
            />
          </div>
          <div className="tag-container">
            {tags.map((tag, index) => (
              <div key={index}>
                {tag}{" "}
                <button className="delete-tags" onClick={() => deleteTags(tag)}>
                  X
                </button>
              </div>
            ))}
            <div>
              <input
                type="text"
                value={newTag}
                placeholder="Add Tags Here"
                onChange={(e) => {
                  setNewTag(e.target.value);
                }}
              />
              <button onClick={addTags} disabled={!newTag?.trim() || loading}>
                Add Tag
              </button>
              <div className="button-container">
                <input
                  type="text"
                  value={comment}
                  onChange={safeSetComment}
                  placeholder="Add a Comment Here"
                />
                <button
                  onClick={saveChanges}
                  disabled={!comment?.trim() || loading}
                >
                  Save Changes
                </button>
                <p>
                  {comment
                    ? `${comment.length}/255 characters`
                    : "Comment Required"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditWiki;
