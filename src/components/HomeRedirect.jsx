import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const skipWelcome = localStorage.getItem('skipWelcome') === 'true';
    navigate(skipWelcome ? '/visores' : '/info', { replace: true });
  }, [navigate]);

  return null;
};

export default HomeRedirect;
