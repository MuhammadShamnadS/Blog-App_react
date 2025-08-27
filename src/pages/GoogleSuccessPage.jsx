import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { socialLogin } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Google JWT:", token);

    if (token) {
      // set header temporarily
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // fetch user
      API.get("/me")
        .then((res) => {
          const userData = res.data;
          socialLogin(token, userData);
          navigate("/dashboard"); 
        })
        .catch((err) => {
            console.log("failed");
          console.error("Google login failed:", err);
          navigate("/login");
        });
    } else {
        console.log("fail");
      navigate("/login");
    }
  }, [navigate, socialLogin]);

}
