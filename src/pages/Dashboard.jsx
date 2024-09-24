import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Activity, Heart, Thermometer, Droplet, User, Brain } from 'lucide-react'

// Mock data for charts
const generateChartData = () => Array.from({ length: 20 }, (_, i) => ({ x: i, y: Math.random() * 100 }))

const LineChart = ({ data, width, height, color }) => {
  const svgRef = useRef(null)

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove() // Clear previous chart

      const margin = { top: 20, right: 20, bottom: 30, left: 40 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerWidth])
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).range([innerHeight, 0])

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.y))

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line)

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))

      g.append("g")
        .call(d3.axisLeft(y))
    }
  }, [data, width, height, color])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

const CircularMetric = ({ value, total, label, icon: Icon }) => {
  const percentage = (value / total) * 100
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-16 h-16">
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
            stroke="#4caf50"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

export default function MedicalDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Personalized Dashboard */}
          <div className="col-span-1 bg-card rounded-lg shadow p-4">
            <img src="/placeholder.svg?height=100&width=100" alt="Patient" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-center mb-2">John Doe</h2>
            <p className="text-sm text-center text-muted-foreground mb-4">Patient ID: 12345</p>
            <div className="text-sm">
              <p><strong>Age:</strong> 45</p>
              <p><strong>Doctor:</strong> Dr. Jane Smith</p>
              <p><strong>Next Appointment:</strong> 15 Oct 2024</p>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="col-span-3 bg-card rounded-lg shadow p-4">
            <h1 className="text-2xl font-bold mb-4">Health Check</h1>

            {/* Line Charts */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Heart Rate", color: "#ff6b6b" },
                { label: "Blood Pressure", color: "#4ecdc4" },
                { label: "Blood Sugar", color: "#45aaf2" },
                { label: "Cholesterol", color: "#fed330" },
                { label: "BMI", color: "#26de81" },
                { label: "Sleep Pattern", color: "#a55eea" }
              ].map((chart, index) => (
                <div key={index} className="bg-card-foreground rounded-lg p-2">
                  <h3 className="text-lg font-semibold mb-2">{chart.label}</h3>
                  <LineChart data={generateChartData()} width={300} height={150} color={chart.color} />
                </div>
              ))}
            </div>

            {/* Circular Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <CircularMetric value={72} total={100} label="Heart Rate" icon={Heart} />
              <CircularMetric value={120} total={200} label="Blood Pressure" icon={Activity} />
              <CircularMetric value={98} total={100} label="Blood Oxygen" icon={User} />
              <CircularMetric value={37} total={50} label="Temperature" icon={Thermometer} />
              <CircularMetric value={85} total={100} label="Hydration" icon={Droplet} />
              <CircularMetric value={95} total={100} label="Mental Health" icon={Brain} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
