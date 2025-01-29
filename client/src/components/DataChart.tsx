import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataChart: React.FC = () => {

  const [moodScores, setMoodScores] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get(`${import.meta.env.VITE_API_URL}/dashboard/yourprogress`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            jwt_token: localStorage.token
          }
        });
        const data = (await response).data;

        const scores = data.map((entry: any) => entry.journalentry_mood_score);
        const dates = data.map((entry: any) => new Date(entry.journalentry_created_at).toLocaleDateString());

        setMoodScores(scores);
        setLabels(dates);
      } catch (error) {
        console.error("Error fetching mood scores: ", error);
      }
    };
    fetchData();
  }, [moodScores, labels]);

  const chartData: ChartData<'line'> = {
    labels: labels,
    datasets: [{
      label: 'Mood Scores',
      data: moodScores,
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: '#9333EA',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#9333EA',
      pointBorderColor: '#ffffff',
      pointRadius: 6,
      pointHoverRadius: 8,
    }],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white',
          stepSize: 10
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
          padding: 20
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get("https://companion-production-fbf6.up.railway.app/dashboard/yourprogress", {
          withCredentials: true,
          headers: { jwt_token: localStorage.token }
        });
        const data = (await response).data;

        const scores = data.map((entry: any) => entry.journalentry_mood_score);
        const dates = data.map((entry: any) => new Date(entry.journalentry_created_at).toLocaleDateString());

        setMoodScores(scores);
        setLabels(dates);
      } catch (error) {
        console.error("Error fetching mood scores: ", error);
      }
    };
    fetchData();
  }, []);



  return (
    <div className='animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 h-screen flex flex-col'>
      <div className='w-full max-w-7xl mx-auto px-4 py-8 flex flex-col flex-grow max-h-[90vh]'>
        <h1 className='text-white text-center text-2xl font-bold pt-20 pb-6 animate-fade-down'>Your Mood Progress</h1>
        <div className='flex-grow animate-fade animate-delay-1000'>
          <Line data={chartData} options={options} id='moodChart' />
        </div>
      </div>
    </div>
  )
}

export default DataChart