import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

const EditHistory = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/pages/${id}/history`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      {history.map((edit) => {
        return (
          <div className="past-edit" key={edit.id}>
            <h2>{`Edit made: ${edit.created_at}`}</h2>
            <p>{`User: ${edit.email}`}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EditHistory;
