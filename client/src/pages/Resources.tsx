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

  const fetchRelevantVideo = async (resourceTitle: string): Promise<string> => {
    try {
      const response = await axios.get(`http://localhost:5000/dashboard/resources/youtube-search`, {
        params: {
          query: resourceTitle
        },
        headers: { jwt_token: localStorage.token }
      });
      return `https://www.youtube.com/embed/${response.data.videoId}`;
    } catch (error) {
      console.error("Error fetching video:", error);
      return '';
    }
  };

  const ResourceList = ({ resources }: { resources: string[] }) => {
    const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
    const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});

    useEffect(() => {
      const loadVideos = async () => {
        const videoMap: Record<string, string> = {};
        const loadingMap: Record<string, boolean> = {};

        resources.forEach(resource => {
          loadingMap[resource] = true;
        });
        setLoadingVideos(loadingMap);

        for (const resource of resources) {
          const videoUrl = await fetchRelevantVideo(resource);
          videoMap[resource] = videoUrl;
          setLoadingVideos(prev => ({
            ...prev,
            [resource]: false
          }));
        }
        setVideoUrls(videoMap);
      };
      loadVideos();
    }, [resources]);

    return (
      <div className='space-y-4 mt-4'>
        {resources.map((resource, index) => (
          <div key={index} className='text-center p-4 border border-gray-700 rounded-lg'>
            <h3 className='font-semibold mb-2'>{resource}</h3>
            {loadingVideos[resource] ? (
              <div className="h-[157px] flex items-center justify-center">
                <p className="text-gray-400">Fetching video...</p>
              </div>
            ) : (
              videoUrls[resource] && (
                <iframe
                  width="280"
                  height="157"
                  src={videoUrls[resource]}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )
            )}
          </div>
        ))}
      </div>
    );
  };

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

    if (averageMoodScore < 30) {
      resources = [
        "Coping strategies for depression",
        "Mindfulness exercises for anxiety",
        "Professional mental health support",
        "Self-care techniques"
      ];
    } else if (averageMoodScore < 60) {
      resources = [
        "Guided meditation techniques",
        "Stress management strategies",
        "Positive thinking exercises",
        "Mood improvement activities"
      ];
    } else {
      resources = [
        "Maintaining mental wellness",
        "Advanced meditation practices",
        "Personal growth strategies"
      ];
    }
    return <ResourceList resources={resources} />
  };

  return (
    <div className='animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 min-h-screen text-white flex flex-col'>
      <Navigation />
      <div className='flex-grow flex flex-col items-center p-6'>
        <h1 className='text-2xl font-bold my-40 animate-fade animate-delay-1000'>Resources</h1>
        {averageMoodScore !== null && (
          <p className='font-bold text-lg text-center max-w-2xl animate-fade-down'>Based on your average mood score of: {averageMoodScore.toFixed(2)} here are some resources I believe may help!</p>
        )}
        <div className='text-center animate-fade-down'>
          {renderResources()}
        </div>
        <Lottie animationData={animationData} style={{ width: 200, height: 200 }} />
      </div>
    </div>
  )
}

export default Resources