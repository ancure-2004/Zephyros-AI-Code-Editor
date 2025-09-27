import React, { useContext } from "react";
import { UserContext } from "../context/user.context";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // wait until user is restored
  }

  // If logged in, redirect to /projects
  if (user) {
    return <Navigate to="/projects" replace />;
  }

  return children;
};

export default PublicRoute;
