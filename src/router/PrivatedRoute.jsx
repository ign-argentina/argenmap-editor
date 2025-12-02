import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivatedRoute = ({ element }) => {
  const { isAuth, isAuthLoading } = useUser();
  
  if (isAuthLoading) {
    return <div>Loading...</div>; 
  }
  
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivatedRoute;