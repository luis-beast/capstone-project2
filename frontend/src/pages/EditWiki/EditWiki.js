import { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditWiki.css";

const EditWiki = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [page, setPage] = useState({});
  const [loading, setLoading] = useState(true);
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    setLoading(true);
    //TODO - initial fetch to make sure that nobody else is editing the page
    if (state?.page && state.page.id === id) {
      //cached version of the page passed in via state
      setPage(state.page);
    } else {
      fetch(`http://localhost:8080/pages/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 1) {
            setPage(data[0]);
            setEditorValue(data[0].body);
          } else {
            throw new Error(data.message ? data.message : "Page not found");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id, state]);

  const saveChanges = () => {
    setLoading(true);
    const newBody = editorValue;
    const newArticle = { id: page.id, title: page.title, body: newBody }; //TODO - add tags
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newArticle),
    };
    fetch(`http://localhost:8080/pages/${id}`, init)
      .then((res) => {
        if (res.status == 201) {
          console.log("Article successfully updated");
          //TODO - navigate user to the article page
        } else {
          throw new Error(`${res.status} Error`);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="edit-wiki">
      <h1>{page.title}</h1>
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
      <div className="button-container">
        <button onClick={saveChanges}>Save Changes</button>
      </div>
      <div className="tag-container"></div>
    </div>
  );
};

export default EditWiki;
