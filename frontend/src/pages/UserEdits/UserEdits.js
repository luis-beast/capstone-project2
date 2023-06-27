import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const UserEdits = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentPage, SetCurrentPage] = useState();
  const [userHistory, setUserHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/users/${id}/history`)
      .then((res) => res.json())
      .then((data) => {
        setUserHistory(data);
        console.log("useEffect", data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const dataGridColums = [
    { field: "created_at", headerName: "Created", flex: 1 },
    { field: "updated_at", headerName: "Updated", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
  ];

  const handleRowClick = (params) => {
    //   let title = `${params.row.created_at}::${current.title}`;
    //   let body = params.row.body;
    // navigate(`/users/${id}/history/${params.row.id}`, {
    //   state: {
    //     page: {
    //       ...currentPage,
    //       title: title,
    //       body: body,
    //       email: params.row.email,
    //     },
    //   },
    // });
  };

  //   // a page that a signed in user can view to see all the edits they've created

  return (
    <div className="user-history">
      <DataGrid
        rows={userHistory}
        columns={dataGridColums}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default UserEdits;
