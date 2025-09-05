import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NetworkVisualization = ({ networkData, optimizedSpeeds, trafficLights }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!networkData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create node positions (simple layout)
    const nodes = {};
    const nodeList = [...new Set([
      ...networkData.map(edge => edge.from),
      ...networkData.map(edge => edge.to)
    ])];

    // Position nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    nodeList.forEach((node, index) => {
      const angle = (index / nodeList.length) * 2 * Math.PI;
      nodes[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Draw edges
    networkData.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Color based on optimized speed
        const speed = optimizedSpeeds?.[`${edge.from}-${edge.to}`] || edge.speed_limit || 50;
        const normalizedSpeed = Math.min(speed / 100, 1);
        const red = Math.floor(255 * (1 - normalizedSpeed));
        const green = Math.floor(255 * normalizedSpeed);
        ctx.strokeStyle = `rgb(${red}, ${green}, 0)`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;
        
        ctx.beginPath();
        ctx.moveTo(
          toNode.x - arrowLength * Math.cos(angle - arrowAngle),
          toNode.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(toNode.x, toNode.y);
        ctx.lineTo(
          toNode.x - arrowLength * Math.cos(angle + arrowAngle),
          toNode.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();

        // Draw speed label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(`${speed.toFixed(0)} km/h`, midX + 5, midY - 5);
      }
    });

    // Draw nodes
    nodeList.forEach(node => {
      const nodePos = nodes[node];
      ctx.beginPath();
      ctx.arc(nodePos.x, nodePos.y, 20, 0, 2 * Math.PI);
      
      // Color traffic light nodes differently
      if (trafficLights && trafficLights[node]) {
        ctx.fillStyle = '#ff6b6b';
      } else {
        ctx.fillStyle = '#4ecdc4';
      }
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node, nodePos.x, nodePos.y + 5);
    });

    // Draw legend
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', 10, 20);
    ctx.fillText('🔴 Traffic Light Node', 10, 40);
    ctx.fillText('🔵 Regular Node', 10, 60);
    ctx.fillText('Edge Color: Green = High Speed, Red = Low Speed', 10, 80);

  }, [networkData, optimizedSpeeds, trafficLights]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Traffic Network Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded-lg w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </CardContent>
    </Card>
  );
};

export default NetworkVisualization;

