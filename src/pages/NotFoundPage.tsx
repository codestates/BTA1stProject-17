import { useLocation } from 'react-router-dom';

function NotFoundPage() {
  const location = useLocation();
  return <div>{location.pathname}</div>;
}

export default NotFoundPage;
