import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Lottie from 'lottie-react';
import animationData from '../../public/heart-animation.json';

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
      return <div>It looks like you might benefit from some support. Here are some resources:
        <br></br>
        <br></br>
        1. 24/7 mental health helpline Australia 1300-22-4636 (Beyond Blue)
        <br></br>
        <br></br>
        2. Reach out to loved ones
        <br></br>
        <br></br>
        3. Cognitive Behavioural Therapy (CBT) exercises
        <br></br>
        <br></br>
        4. Local support groups finder
      </div>
    } else if (averageMoodScore < 0.7) {
      return <div>It seems you are doing alright. Whether you are on the right path, or struggling once again, here are some resources I believe would be useful:
        <br></br>
        <br></br>
        1. 24/7 mental health helpline Australia 1300-22-4636 (Beyond Blue)
        <br></br>
        <br></br>
        2. Mindfulness meditation
        <br></br>
        <br></br>
        3. Cognitive Behavioural Therapy (CBT) exercises
        <br></br>
        <br></br>
        4. Gratitude journaling prompts
      </div>
    } else {
      return <div>Your mood seems good! Here are some resources to continue maintaining your wellbeing:
        <br></br>
        <br></br>
        1. Mindfulness meditation
        <br></br>
        <br></br>
        2. Gratitude journaling prompts
        <br></br>
        <br></br>
        3. Positive psychology podcast
      </div>
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 h-screen text-white flex flex-col'>
      <Navigation />
      <div className='flex-grow flex flex-col items-center p-6'>
        <h1 className='text-2xl font-bold my-40 animate-fade animate-delay-1000'>Resources</h1>
        {averageMoodScore !== null && (
          <p className='mb-4 text-center max-w-2xl animate-fade-down'>Based on your average mood score of: {averageMoodScore.toFixed(2)} here are some resources I believe may help!</p>
        )}
        <div className='text-center animate-fade-down'>
          {renderResources()}
        </div>
        <Lottie animationData={animationData} style={{ width: 200, height: 200}} />
      </div>
    </div>
  )
}

export default Resources