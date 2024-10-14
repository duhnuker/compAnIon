import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend ,ChartData, ChartOptions } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataChart: React.FC = () => {

  const [moodScores, setMoodScores] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get("http://localhost:5000/dashboard/yourprogress", {
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
  }, [moodScores, labels]);

  const chartData: ChartData<'line'> = {
    labels: labels,
    datasets: [
      {
        label: 'Mood Scores',
        data: moodScores,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 10,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
      },
      x: {
        grid: {
          color: 'white'
        },
        ticks: {
          color: 'white',
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



  return (
    <div className='bg-midnightp1 h-screen flex flex-col'>
      <div className='w-full max-w-7xl mx-auto px-4 py-8 flex flex-col flex-grow'>
      <h1 className='text-white text-center text-2xl font-bold py-4'>Your Mood Progress</h1>
      <div className='flex-grow'>
      <Line data={chartData} options={options} id='moodChart' />
      </div>
      </div>
    </div>
  )
}

export default DataChart