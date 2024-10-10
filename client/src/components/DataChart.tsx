import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import axios from 'axios';

const DataChart: React.FC = () => {

  const [moodScores, setMoodScores] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get("http://localhost:5000/dashboard/yourprogress");
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

  const chartData: ChartData<'bar'> = {
    labels: labels,
    datasets: [
      {
        label: 'Mood Scores',
        data: moodScores,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };



  return (
    <div>Your Mood Progress
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default DataChart