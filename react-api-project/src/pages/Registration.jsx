import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Registration from "../components/Registration";
import { AuthContext } from "../context/AuthContext";

export default function RegistrationPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <Registration />;
}