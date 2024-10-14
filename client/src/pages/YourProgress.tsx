import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataChart from '../components/DataChart';

const YourProgress = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login')
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Your progress</h1>
      <DataChart />
    </div>
  )
}

export default YourProgress