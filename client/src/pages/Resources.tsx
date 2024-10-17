import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Resources = () => {

  const [averageMoodScore, setAverageMoodScore] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login')
    } else {
      setIsAuthenticated(true);
      fetchAverageMoodScore();
    }
  }, [navigate]);

  const fetchAverageMoodScore = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/resources", {
        headers: { jwt_token: localStorage.token }
      });
      const averageToNum = Number(response.data.averageMoodScore);
      setAverageMoodScore(isNaN(averageToNum) ? null : averageToNum);
    } catch (error) {
      console.error("Error fetching average mood score", error);
    }
  };

  const renderResources = () => {
    if (averageMoodScore === null) {
      return <div>Loading resources...</div>
    }
    if (averageMoodScore < 0.3) {
      return <div>Resources for a low mood</div>
    } else if (averageMoodScore < 0.7) {
      return <div>Resources for a moderate mood</div>
    } else {
      return <div>Resources from a high mood</div>
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Resources</h1>
      {averageMoodScore !== null && (
      <p>Based on your average mood score of: {averageMoodScore.toFixed(2)} here are some resources I believe may help!</p>
      )}
      {renderResources()};
    </div>
  )
}

export default Resources