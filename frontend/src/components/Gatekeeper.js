import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Gatekeeper = ({ userData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.id) {
      navigate("/login", { replace: true });
    }
  }, [userData]);

  return !userData.id && <div>You must log in to view this resource.</div>;
};

export default Gatekeeper;
