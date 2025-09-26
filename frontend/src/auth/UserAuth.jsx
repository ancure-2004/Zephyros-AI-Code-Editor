import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted user if context is empty
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        // optional: update context if needed
        // setUser(JSON.parse(savedUser)); 
        setLoading(false);
        return;
      }
      // No user found, redirect
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserAuth;
