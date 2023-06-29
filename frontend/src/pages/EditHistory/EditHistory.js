import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./EditHistory.css";
import moment from "moment";

const EditHistory = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(state?.page ? state.page : {});
  const [title, setTitle] = useState("");
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
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`${res.status} Error`);
        }
      })
      .then((data) =>
        setHistory(
          data.map((row) => ({
            ...row,
            grid_date: moment
              .utc(row.created_at)
              .format("DD MMM YYYY hh:mm:ss"),
          }))
        )
      )
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const dataGridColums = [
    { field: "grid_date", headerName: "Timestamp", flex: 1 },
    { field: "email", headerName: "User", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
  ];

  const handleRowClick = (params) => {
    let momentTime = moment
      .utc(params.row.created_at)
      .format("DD MMM YYYY hh:mm:ss");
    let title = `${momentTime} :: ${currentPage.title}`;
    let body = params.row.body;
    let email = params.row.email;
    navigate(`/page/${id}/history/${params.row.id}`, {
      state: {
        page: {
          ...currentPage,
          title: title,
          body: body,
          email: email,
        },
      },
    });
  };

  // a page that a signed in user can view to see all the edits they've created

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
