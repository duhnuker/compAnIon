import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataChart from '../components/DataChart';
import Navigation from '../components/Navigation';

const YourProgress = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='text-center'>
      <Navigation setAuth={setAuth} />
      <DataChart />
    </div>
  )
}

export default YourProgress