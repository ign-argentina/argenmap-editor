import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivatedRoute = ({ element }) => {
  const { isAuth, isLoading } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>; 
  }
  
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivatedRoute;