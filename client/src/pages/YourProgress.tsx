import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataChart from '../components/DataChart';
import Navigation from '../components/Navigation';

const YourProgress = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='text-center'>
      <Navigation />
      <DataChart />
    </div>
  )
}

export default YourProgress