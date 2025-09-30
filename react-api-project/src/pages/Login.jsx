import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <Login />;
}