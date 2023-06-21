import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const EditHistory = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(state?.page ? state.page : {});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (!currentPage.title) {
      fetch(`http://localhost:8080/pages/${id}`)
        .then((res) => res.json())
        .then((data) => setCurrentPage(data[0]))
        .catch((err) => console.log(err));
    }
    fetch(`http://localhost:8080/pages/${id}/history`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const dataGridColums = [
    { field: "created_at", headerName: "Timestamp", flex: 1 },
    { field: "email", headerName: "User", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
  ];

  const handleRowClick = (params) => {
    let title = `${params.row.created_at}::${currentPage.title}`;
    let body = params.row.body;
    navigate(`/page/${id}`, {
      state: {
        page: { ...currentPage, title: title, body: body },
        pastVersion: true,
      },
    });
  };

  return (
    <div className="edit-history">
      {currentPage.title && <h1>Edit History for {currentPage.title}</h1>}
      <DataGrid
        rows={history}
        columns={dataGridColums}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default EditHistory;
