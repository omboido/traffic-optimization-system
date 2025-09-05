import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Settings, Download } from 'lucide-react';

const OptimizationControls = ({ onRunOptimization, isRunning, onParameterChange, parameters }) => {
  const [localParams, setLocalParams] = useState({
    generations: parameters?.generations || 50,
    populationSize: parameters?.populationSize || 10,
    mutationRate: parameters?.mutationRate || 0.1,
    algorithm: parameters?.algorithm || 'genetic',
    objective: parameters?.objective || 'velocity_stops'
  });

  const handleParameterChange = (key, value) => {
    const newParams = { ...localParams, [key]: value };
    setLocalParams(newParams);
    onParameterChange?.(newParams);
  };

  const handleRunOptimization = () => {
    onRunOptimization?.(localParams);
  };

  const exportResults = () => {
    // This would export the current optimization results
    console.log('Exporting results...');
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimization Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <Select
              value={localParams.algorithm}
              onValueChange={(value) => handleParameterChange('algorithm', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                <SelectItem value="simulated_annealing">Simulated Annealing</SelectItem>
                <SelectItem value="particle_swarm">Particle Swarm Optimization</SelectItem>
                <SelectItem value="tabu_search">Tabu Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objective Function */}
          <div className="space-y-2">
            <Label htmlFor="objective">Optimization Objective</Label>
            <Select
              value={localParams.objective}
              onValueChange={(value) => handleParameterChange('objective', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="velocity_stops">Maximize Velocity, Minimize Stops</SelectItem>
                <SelectItem value="velocity_only">Maximize Velocity Only</SelectItem>
                <SelectItem value="stops_only">Minimize Stops Only</SelectItem>
                <SelectItem value="fuel_efficiency">Optimize Fuel Efficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generations */}
          <div className="space-y-2">
            <Label htmlFor="generations">
              Generations: {localParams.generations}
            </Label>
            <Slider
              value={[localParams.generations]}
              onValueChange={(value) => handleParameterChange('generations', value[0])}
              max={200}
              min={10}
              step={10}
              className="w-full"
            />
          </div>

          {/* Population Size */}
          <div className="space-y-2">
            <Label htmlFor="populationSize">
              Population Size: {localParams.populationSize}
            </Label>
            <Slider
              value={[localParams.populationSize]}
              onValueChange={(value) => handleParameterChange('populationSize', value[0])}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Mutation Rate */}
          <div className="space-y-2">
            <Label htmlFor="mutationRate">
              Mutation Rate: {(localParams.mutationRate * 100).toFixed(1)}%
            </Label>
            <Slider
              value={[localParams.mutationRate * 100]}
              onValueChange={(value) => handleParameterChange('mutationRate', value[0] / 100)}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleRunOptimization}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Optimization
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={exportResults}
              disabled={isRunning}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Optimizing..." : "Ready"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Information */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {localParams.algorithm === 'genetic' && (
              <div>
                <p className="font-medium">Genetic Algorithm</p>
                <p className="text-muted-foreground">
                  Evolutionary approach that mimics natural selection to find optimal solutions.
                  Good for complex, multi-objective optimization problems.
                </p>
              </div>
            )}
            {localParams.algorithm === 'simulated_annealing' && (
              <div>
                <p className="font-medium">Simulated Annealing</p>
                <p className="text-muted-foreground">
                  Probabilistic technique that allows occasional worse solutions to escape local optima.
                  Effective for large solution spaces.
                </p>
              </div>
            )}
            {localParams.algorithm === 'particle_swarm' && (
              <div>
                <p className="font-medium">Particle Swarm Optimization</p>
                <p className="text-muted-foreground">
                  Swarm intelligence method inspired by bird flocking behavior.
                  Fast convergence for continuous optimization problems.
                </p>
              </div>
            )}
            {localParams.algorithm === 'tabu_search' && (
              <div>
                <p className="font-medium">Tabu Search</p>
                <p className="text-muted-foreground">
                  Local search method that uses memory structures to avoid cycling.
                  Excellent for combinatorial optimization problems.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationControls;

