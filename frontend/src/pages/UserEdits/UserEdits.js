import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const UserEdits = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/users/${id}/history`)
      .then((res) => res.json())
      .then((data) => {
        setUserHistory(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const dataGridColums = [
    { field: "title", headerName: "WikiPage", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
    { field: "updated_at", headerName: "Updated", flex: 1 },
  ];

  const handleRowClick = (params) => {
    let title = params.row.title;
    let body = params.row.body;
    let email = params.row.email;
    navigate(`/page/${params.row.page_id}/history/${params.row.id}`, {
      state: {
        page: {
          title: title,
          body: body,
          email: email,
        },
      },
    });
  };

  return (
    <div className="user-history">
      {userHistory?.length > 0 && userHistory[0].user_id && (
        <h1>
          {`Edit History for ${userHistory[0].first_name} ${userHistory[0].last_name}`}
        </h1>
      )}
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
