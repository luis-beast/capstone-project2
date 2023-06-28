import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import UserContext from "../../userContext";

const UserEdits = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  const navigate = useNavigate();
  const [rollbackMode, setRollbackMode] = useState(false);
  const [timestamps, setTimestamps] = useState({});

  const [userData, setUserData] = useContext(UserContext);
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
    { field: "created_at", headerName: "Timestamp", flex: 1 },
    { field: "title", headerName: "WikiPage", flex: 1 },
    { field: "comment", headerName: "Comment", flex: 1 },
  ];

  const handleRowClick = (params) => {
    if (rollbackMode) {
      if (timestamps.start) {
        setTimestamps({ start: timestamps.start, end: params.row.created_at });
      } else {
        setTimestamps({ start: params.row.created_at });
      }
    } else {
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
    }
  };

  const handleRollbackModeClick = (e) => {
    e.preventDefault();
    setTimestamps({});
    setRollbackMode(!rollbackMode);
  };

  const handleRollback = (e) => {
    e.preventDefault();
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_id: userData.id,
        start_timestamp: timestamps.start,
        end_timestamp: timestamps.end,
      }),
    };
    console.log(init.body);
    fetch(`http://localhost:8080/users/${userHistory[0].user_id}/revert`, init)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Unable to roll back user history");
        }
      })
      .then((data) => {
        setRollbackMode(false);
        console.log(data.message);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="user-history">
      {userHistory?.length > 0 && userHistory[0].user_id && (
        <h1>
          {rollbackMode
            ? `Revert Edits By ${userHistory[0].first_name} ${userHistory[0].last_name}`
            : `Edit History for ${userHistory[0].first_name} ${userHistory[0].last_name}`}
        </h1>
      )}
      {userData.is_admin && (
        <div className="revert-panel">
          <button onClick={handleRollbackModeClick}>
            {rollbackMode ? "Cancel Rollback" : "Roll back user edits"}
          </button>
          {rollbackMode && (
            <div className="revert-input">
              <h4>
                Click on the first and last edits you would like to revert
              </h4>
              <p>Start Timestamp: {timestamps.start}</p>
              <p>End Timestamp: {timestamps.end} </p>
              {timestamps.start && timestamps.end && (
                <>
                  <p>
                    All wiki page edits by {userHistory[0].email} from{" "}
                    {timestamps.start.slice(0, -5)} to{" "}
                    {timestamps.end.slice(0, -5)} will be reverted and the
                    entries in the edit history deleted.
                  </p>
                  <p>
                    All wiki pages created by {userHistory[0].email} within this
                    timeframe will be deleted.
                  </p>
                  <p>Click below to proceed.</p>
                  <button onClick={handleRollback}>Rollback</button>
                </>
              )}
            </div>
          )}
        </div>
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
