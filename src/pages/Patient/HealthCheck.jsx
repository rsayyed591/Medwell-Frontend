import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { AnimatedCard, CircularMetric } from './SharedComponents'
import CombinedChat from "../Chatbots/CombinedChat"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChart = ({ data, color, label }) => {
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
  }

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
  }

  return <Line data={chartData} options={options} />
}

export default function HealthCheck({ isLoaded, charts }) {
  return (
    <>
      {/* Line Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {charts.map((chart, index) => (
          <AnimatedCard key={index} index={index + 1}>
            <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{chart.label}</h3>
              <div className="h-40">
                {isLoaded && <LineChart data={chart.data} color={chart.color} label={chart.label} />}
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
              value={chart.data[chart.data.length - 1]}
              total={Math.max(...chart.data)}
              label={chart.label}
              icon={chart.icon}
              color={chart.color}
            />
          </AnimatedCard>
        ))}
        <CombinedChat/>
      </div>
    </>
  )
}
