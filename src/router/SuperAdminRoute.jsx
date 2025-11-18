import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const  SuperAdminRoute = ({ element }) => {
  const { isAuth, isLoading, superAdmin } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>; 
  }
  
  if (!isAuth || superAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default SuperAdminRoute;