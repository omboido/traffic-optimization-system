import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const PerformanceCharts = ({ networkData, optimizedSpeeds, trafficLights, metrics }) => {
  // Prepare data for speed distribution chart
  const speedData = networkData?.map(edge => ({
    road: `${edge.from}-${edge.to}`,
    originalSpeed: edge.speed_limit || 50,
    optimizedSpeed: optimizedSpeeds?.[`${edge.from}-${edge.to}`] || edge.speed_limit || 50,
    improvement: (optimizedSpeeds?.[`${edge.from}-${edge.to}`] || edge.speed_limit || 50) - (edge.speed_limit || 50)
  })) || [];

  // Prepare data for cycle time distribution
  const cycleData = trafficLights ? Object.entries(trafficLights).flatMap(([lightNode, lightInfo]) =>
    Object.entries(lightInfo.cycle_phases || {}).map(([approach, phases]) => ({
      light: `${lightNode}-${approach}`,
      green: phases.green || 0,
      yellow: phases.yellow || 0,
      red: phases.red || 0,
      total: (phases.green || 0) + (phases.yellow || 0) + (phases.red || 0)
    }))
  ) : [];

  // Performance comparison data
  const performanceData = [
    {
      metric: 'Average Velocity',
      value: metrics?.avgVelocity || 0,
      unit: 'm/s',
      target: 15, // Example target
      color: '#10b981'
    },
    {
      metric: 'Average Stops',
      value: metrics?.avgStops || 0,
      unit: 'stops/vehicle',
      target: 0.5, // Example target
      color: '#f59e0b'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Speed Optimization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Speed Limit Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={speedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="road" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="originalSpeed" fill="#94a3b8" name="Original Speed" />
              <Bar dataKey="optimizedSpeed" fill="#10b981" name="Optimized Speed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Light Cycle Distribution */}
      {cycleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Traffic Light Cycle Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="light" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="green" stackId="a" fill="#10b981" name="Green" />
                <Bar dataKey="yellow" stackId="a" fill="#f59e0b" name="Yellow" />
                <Bar dataKey="red" stackId="a" fill="#ef4444" name="Red" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Current Value" />
              <Bar dataKey="target" fill="#94a3b8" name="Target Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Speed Improvement Distribution */}
      {speedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Speed Improvement Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="road" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Speed Change (km/h)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="improvement" stroke="#8884d8" strokeWidth={2} name="Speed Improvement" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Roads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkData?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Traffic Lights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(trafficLights || {}).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Cycle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycleData.length > 0 
                ? (cycleData.reduce((sum, cycle) => sum + cycle.total, 0) / cycleData.length).toFixed(1)
                : 0}s
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceCharts;

