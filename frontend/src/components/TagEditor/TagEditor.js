import { useState, useEffect } from "react";
import "./TagEditor.css";

const TagEditor = ({ currentTags, setCurrentTags, loading }) => {
  const [newTag, setNewTag] = useState("");
  const [dbTags, setDbTags] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/tags")
      .then((res) => res.json())
      .then((data) => setDbTags(data))
      .catch((err) => console.log(err));
  }, []);

  const addTags = () => {
    if (newTag.trim() && !currentTags.includes(newTag.toLowerCase())) {
      setCurrentTags([
        ...currentTags,
        ...newTag.trim().toLowerCase().split(" "),
      ]);
      setNewTag("");
    }
  };

  const deleteTags = (tag) => {
    setCurrentTags(currentTags.filter((t) => t !== tag));
  };

  return (
    <div className="tag-editor">
      <div className="editor-tag-list">
        {currentTags.map((tag, index) => (
          <div key={index}>
            {tag}{" "}
            <button className="delete-tags" onClick={() => deleteTags(tag)}>
              X
            </button>
          </div>
        ))}
      </div>

      <input
        value={newTag}
        list="page-tag-list"
        placeholder="Add Tags Here"
        onChange={(e) => {
          setNewTag(e.target.value);
        }}
      />
      <datalist id="page-tag-list">
        {!!dbTags?.length &&
          dbTags.map((dbTag) => {
            return <option key={dbTag.id} value={dbTag.name} />;
          })}
      </datalist>
      <button
        className="add-tag"
        onClick={addTags}
        disabled={!newTag?.trim() || loading}
      >
        Add Tag
      </button>
    </div>
  );
};

export default TagEditor;
