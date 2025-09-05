import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, BarChart3, Network, Settings, TrendingUp } from 'lucide-react';
import NetworkVisualization from './components/NetworkVisualization';
import OptimizationResults from './components/OptimizationResults';
import PerformanceCharts from './components/PerformanceCharts';
import OptimizationControls from './components/OptimizationControls';
import './App.css';

function App() {
  const [networkData, setNetworkData] = useState([]);
  const [trafficLights, setTrafficLights] = useState({});
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [optimizedSpeeds, setOptimizedSpeeds] = useState({});
  const [optimizedCycles, setOptimizedCycles] = useState({});
  const [metrics, setMetrics] = useState({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationParams, setOptimizationParams] = useState({
    generations: 50,
    populationSize: 10,
    mutationRate: 0.1,
    algorithm: 'genetic',
    objective: 'velocity_stops'
  });

  // Sample data - in a real application, this would come from an API
  useEffect(() => {
    // Sample network data
    const sampleNetworkData = [
      { from: 'A', to: 'B', length: 500, speed_limit: 50 },
      { from: 'B', to: 'C', length: 300, speed_limit: 60 },
      { from: 'C', to: 'D', length: 700, speed_limit: 40 },
      { from: 'D', to: 'A', length: 600, speed_limit: 55 },
      { from: 'B', to: 'E', length: 400, speed_limit: 45 },
      { from: 'E', to: 'C', length: 200, speed_limit: 35 },
      { from: 'A', to: 'F', length: 800, speed_limit: 70 },
      { from: 'F', to: 'D', length: 450, speed_limit: 50 }
    ];

    const sampleTrafficLights = {
      'B': {
        approaches: ['A', 'E'],
        cycle_phases: {
          'A': { green: 30, yellow: 3, red: 27 },
          'E': { green: 25, yellow: 3, red: 32 }
        }
      },
      'C': {
        approaches: ['B', 'E'],
        cycle_phases: {
          'B': { green: 35, yellow: 3, red: 22 },
          'E': { green: 20, yellow: 3, red: 37 }
        }
      }
    };

    const sampleVehicleCounts = {
      'B': { 'A': 1000, 'E': 800 },
      'C': { 'B': 1200, 'E': 900 }
    };

    // Sample optimization results
    const sampleOptimizedSpeeds = {
      'A-B': 65.2,
      'B-C': 72.8,
      'C-D': 58.4,
      'D-A': 61.7,
      'B-E': 52.3,
      'E-C': 48.9,
      'A-F': 78.5,
      'F-D': 55.1
    };

    const sampleOptimizedCycles = {
      'B': {
        'A': { green: 32.5, yellow: 3.2, red: 24.3 },
        'E': { green: 28.7, yellow: 3.1, red: 28.2 }
      },
      'C': {
        'B': { green: 38.2, yellow: 3.3, red: 18.5 },
        'E': { green: 22.8, yellow: 2.9, red: 34.3 }
      }
    };

    const sampleMetrics = {
      avgVelocity: 12.45,
      avgStops: 0.73
    };

    setNetworkData(sampleNetworkData);
    setTrafficLights(sampleTrafficLights);
    setVehicleCounts(sampleVehicleCounts);
    setOptimizedSpeeds(sampleOptimizedSpeeds);
    setOptimizedCycles(sampleOptimizedCycles);
    setMetrics(sampleMetrics);
  }, []);

  const handleRunOptimization = async (params) => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    try {
      // In a real application, this would call your Python backend
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 second optimization
      
      // Generate some random optimization results for demo
      const newOptimizedSpeeds = {};
      networkData.forEach(edge => {
        const baseSpeed = edge.speed_limit;
        const variation = (Math.random() - 0.5) * 30; // ±15 km/h variation
        newOptimizedSpeeds[`${edge.from}-${edge.to}`] = Math.max(30, Math.min(100, baseSpeed + variation));
      });

      const newMetrics = {
        avgVelocity: 10 + Math.random() * 10, // Random velocity between 10-20 m/s
        avgStops: Math.random() * 2 // Random stops between 0-2
      };

      setOptimizedSpeeds(newOptimizedSpeeds);
      setMetrics(newMetrics);
      
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleParameterChange = (params) => {
    setOptimizationParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Network className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Traffic Lights Optimization Dashboard</h1>
              </div>
              <Badge variant="outline" className="text-sm">
                NP-Complete Optimization System
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isOptimizing ? "default" : "secondary"}>
                {isOptimizing ? "Optimizing..." : "Ready"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Controls
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {networkData.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Roads</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">
                        {Object.keys(trafficLights).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Traffic Lights</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Velocity:</span>
                      <span className="text-sm font-medium">{metrics.avgVelocity?.toFixed(2)} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Stops:</span>
                      <span className="text-sm font-medium">{metrics.avgStops?.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Visualization */}
              <div className="lg:col-span-2">
                <NetworkVisualization
                  networkData={networkData}
                  optimizedSpeeds={optimizedSpeeds}
                  trafficLights={trafficLights}
                />
              </div>
            </div>

            {/* Performance Charts */}
            <PerformanceCharts
              networkData={networkData}
              optimizedSpeeds={optimizedSpeeds}
              trafficLights={trafficLights}
              metrics={metrics}
            />
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <NetworkVisualization
              networkData={networkData}
              optimizedSpeeds={optimizedSpeeds}
              trafficLights={trafficLights}
            />
            
            {/* Network Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Road Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {networkData.map((edge, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span className="font-medium">{edge.from} → {edge.to}</span>
                        <div className="text-sm text-muted-foreground">
                          {edge.length}m, {edge.speed_limit} km/h
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Light Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(trafficLights).map(([node, info]) => (
                      <div key={node} className="p-3 border rounded">
                        <div className="font-medium mb-2">Intersection {node}</div>
                        <div className="text-sm text-muted-foreground">
                          Approaches: {info.approaches?.join(', ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Vehicle counts: {Object.entries(vehicleCounts[node] || {}).map(([approach, count]) => 
                            `${approach}: ${count}`
                          ).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <OptimizationResults
              optimizedSpeeds={optimizedSpeeds}
              optimizedCycles={optimizedCycles}
              metrics={metrics}
            />
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <OptimizationControls
              onRunOptimization={handleRunOptimization}
              isRunning={isOptimizing}
              onParameterChange={handleParameterChange}
              parameters={optimizationParams}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;

