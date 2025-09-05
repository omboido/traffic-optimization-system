import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OptimizationResults = ({ optimizedSpeeds, optimizedCycles, metrics }) => {
  if (!optimizedSpeeds || !optimizedCycles || !metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Optimization Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No optimization results available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {metrics.avgVelocity?.toFixed(2) || 'N/A'} m/s
              </div>
              <div className="text-sm text-muted-foreground">Average Velocity</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.avgStops?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Average Stops per Vehicle</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimized Speed Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Speed Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(optimizedSpeeds).map(([road, speed]) => (
              <div key={road} className="flex justify-between items-center">
                <span className="font-medium">Road {road}</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {speed.toFixed(1)} km/h
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Light Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Traffic Light Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(optimizedCycles).map(([lightNode, approaches]) => (
              <div key={lightNode} className="space-y-3">
                <h4 className="font-semibold text-lg">Traffic Light at {lightNode}</h4>
                <div className="space-y-2">
                  {Object.entries(approaches).map(([approach, phases]) => (
                    <div key={approach} className="border rounded-lg p-3">
                      <div className="font-medium mb-2">Approach from {approach}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-green-100 rounded">
                          <div className="font-bold text-green-700">
                            {phases.green?.toFixed(1)}s
                          </div>
                          <div className="text-xs text-green-600">Green</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-100 rounded">
                          <div className="font-bold text-yellow-700">
                            {phases.yellow?.toFixed(1)}s
                          </div>
                          <div className="text-xs text-yellow-600">Yellow</div>
                        </div>
                        <div className="text-center p-2 bg-red-100 rounded">
                          <div className="font-bold text-red-700">
                            {phases.red?.toFixed(1)}s
                          </div>
                          <div className="text-xs text-red-600">Red</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Total cycle: {(phases.green + phases.yellow + phases.red).toFixed(1)}s
                      </div>
                    </div>
                  ))}
                </div>
                {Object.keys(optimizedCycles).length > 1 && lightNode !== Object.keys(optimizedCycles)[Object.keys(optimizedCycles).length - 1] && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationResults;

