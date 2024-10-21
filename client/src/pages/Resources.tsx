import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import Lottie from 'lottie-react';
import animationData from '../../public/heart-animation.json';

const ResourceList = ({ resources }: { resources: string[] }) => (
  <div className='space-y-4 mt-4'>
      {resources.map((resource, index) => (
          <div key={index} className='text-center p-2 border border-gray-700 rounded-lg'>{resource}</div>
      ))}
  </div>
);

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

    let resources: string[];

    if (averageMoodScore < -40) {
        resources = [
            "24/7 mental health helpline Australia 1300-22-4636 (Beyond Blue)",
            "Reach out to loved ones",
            "Cognitive Behavioural Therapy (CBT) exercises",
            "Local support groups finder"
        ];
    } else if (averageMoodScore < 40) {
        resources = [
            "24/7 mental health helpline Australia 1300-22-4636 (Beyond Blue)",
            "Mindfulness meditation",
            "Cognitive Behavioural Therapy (CBT) exercises",
            "Gratitude journaling prompts"
        ];
    } else {
        resources = [
            "Mindfulness meditation",
            "Gratitude journaling prompts",
            "Positive psychology podcast"
        ];
      }
      return <ResourceList resources={resources} />
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
          <p className='font-bold text-lg text-center max-w-2xl animate-fade-down'>Based on your average mood score of: {averageMoodScore.toFixed(2)} here are some resources I believe may help!</p>
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