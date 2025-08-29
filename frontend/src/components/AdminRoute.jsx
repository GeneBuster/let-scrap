import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // 1. Retrieve the user's role from localStorage.
  const userRole = localStorage.getItem('userRole');

  // 2. Check if the role is 'admin'.
  const isAdmin = userRole === 'admin';

  // 3. If the user is an admin, render the child routes (the admin pages).
  //    If not, redirect them to the login page.
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
