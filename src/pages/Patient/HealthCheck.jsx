import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { AnimatedCard, CircularMetric } from './SharedComponents';
import CombinedChat from "../Chatbots/CombinedChat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, color, label }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-4">No data available for {label}</div>;
  }

  const chartData = {
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        display: true,
      },
      y: {
        type: 'linear',
        display: true,
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default function HealthCheck({ isLoaded, charts }) {
  if (!isLoaded) {
    return (
      <div className="text-center text-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        Loading health check data...
      </div>
    );
  }

  if (!Array.isArray(charts) || charts.length === 0) {
    return (
      <div className="text-center text-red-500">
        No health check data available. Please try again later.
      </div>
    );
  }

  return (
    <>
      {/* Line Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <AnimatedCard key={index} index={index + 1}>
            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{chart.label}</h3>
              <div className="h-40">
                <LineChart data={chart.data} color={chart.color} label={chart.label} />
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Circular Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {charts.map((chart, index) => (
          <AnimatedCard key={index} index={index} delay={index >= 3 ? 0.5 : 0}>
            <CircularMetric 
              value={chart.data && chart.data.length > 0 ? chart.data[chart.data.length - 1] : 0}
              total={chart.data && chart.data.length > 0 ? Math.max(...chart.data) : 100}
              label={chart.label}
              icon={chart.icon}
              color={chart.color}
            />
          </AnimatedCard>
        ))}
        <CombinedChat />
      </div>
    </>
  );
}

