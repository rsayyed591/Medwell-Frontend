import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Patient from './../../public/patient.png';
import { Activity, Heart, Thermometer, Droplet, User, Brain } from 'lucide-react';

// Mock data for charts
const generateChartData = () => Array.from({ length: 20 }, (_, i) => ({ x: i, y: Math.random() * 100 }));

const LineChart = ({ data, color }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous chart

      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerWidth]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).range([innerHeight, 0]);

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.y));

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5));

      g.append("g")
        .call(d3.axisLeft(y).ticks(5));
    }
  }, [data, color]);

  return <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet"></svg>;
};

const CircularMetric = ({ value, total, label, icon: Icon, color }) => {
  const percentage = (value / total) * 100;
  return (
    <div className="flex items-center space-x-6">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-600" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold" style={{ color }}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};

export default function MedicalDashboard() {
  const charts = [
    { label: "Heart Rate", color: "#ff6b6b", icon: Heart },
    { label: "Blood Pressure", color: "#4ecdc4", icon: Activity },
    { label: "Blood Sugar", color: "#45aaf2", icon: Droplet },
    { label: "Cholesterol", color: "#fed330", icon: Thermometer },
    { label: "BMI", color: "#26de81", icon: User },
    { label: "Sleep Pattern", color: "#a55eea", icon: Brain }
  ];

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Personalized Dashboard */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <img src={Patient} alt="Patient" className="w-32 h-32 rounded-full mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Vivek Chouhan</h2>
            <p className="text-lg text-center text-gray-600 mb-6">Patient ID: 12345</p>
            <div className="text-lg space-y-2">
              <p><strong className="font-semibold">Age:</strong> 45</p>
              <p><strong className="font-semibold">Doctor:</strong> Dr. Jane Smith</p>
              <p><strong className="font-semibold">Next Appointment:</strong> 15 Oct 2024</p>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="md:col-span-3 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Health Check</h1>

            {/* Line Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {charts.map((chart, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{chart.label}</h3>
                  <div className="h-40">
                    <LineChart data={generateChartData()} color={chart.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* Circular Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {charts.map((chart, index) => (
                <CircularMetric 
                  key={index}
                  value={Math.floor(Math.random() * 100)}
                  total={100}
                  label={chart.label}
                  icon={chart.icon}
                  color={chart.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
