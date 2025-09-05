# Traffic Lights Optimization Dashboard

A comprehensive web-based dashboard for visualizing and controlling traffic light optimization using NP-complete algorithms.

## Features

- **Interactive Network Visualization**: Visual representation of traffic networks with nodes and edges
- **Real-time Optimization Control**: Configure and run genetic algorithm optimization
- **Performance Analytics**: Comprehensive charts and metrics for optimization results
- **Multi-tab Interface**: Organized views for overview, network details, results, and controls
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js with modern hooks
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS
- **Icons**: Lucide React icons
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 22 or higher)
- npm or pnpm package manager

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd traffic-optimizer-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Overview Tab
- View system statistics and network overview
- Monitor key performance metrics
- Access quick network visualization

### Network Tab
- Detailed network visualization with traffic lights and road segments
- View road network details and traffic light locations
- Analyze network topology and connectivity

### Results Tab
- View optimization results including speed limits and signal cycles
- Analyze performance improvements
- Review detailed traffic light timing configurations

### Controls Tab
- Configure optimization parameters (algorithm, generations, population size, etc.)
- Start and monitor optimization runs
- Export results and configurations

## Optimization Parameters

- **Algorithm**: Choose from Genetic Algorithm, Simulated Annealing, Particle Swarm, or Tabu Search
- **Generations**: Number of optimization iterations (10-200)
- **Population Size**: Number of candidate solutions (5-50)
- **Mutation Rate**: Probability of solution mutation (1-50%)
- **Objective**: Optimization goals (velocity, stops, fuel efficiency)

## Performance Metrics

The dashboard displays several key performance indicators:

- **Average Velocity**: Network-wide average vehicle speed
- **Average Stops**: Average number of stops per vehicle
- **Travel Time Reduction**: Percentage improvement over baseline
- **Fuel Consumption**: Estimated fuel usage reduction

## Data Integration

The system supports integration with:

- GIS polyline data for road networks
- Traffic light location and timing data
- Vehicle count data from various sources
- Real-time traffic monitoring systems

## API Integration

The dashboard can be connected to a backend optimization engine through RESTful APIs:

- `/api/network`: Network data management
- `/api/optimization`: Optimization control
- `/api/results`: Results retrieval
- `/api/simulation`: Simulation control

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # UI components (shadcn/ui)
│   ├── NetworkVisualization.jsx
│   ├── OptimizationResults.jsx
│   ├── PerformanceCharts.jsx
│   └── OptimizationControls.jsx
├── assets/              # Static assets
├── App.jsx              # Main application component
├── App.css              # Application styles
└── main.jsx             # Application entry point
```

### Adding New Features

1. Create new components in the `src/components/` directory
2. Import and use in the main `App.jsx` component
3. Add new routes or tabs as needed
4. Update the API integration for new data sources

### Styling

The project uses Tailwind CSS for styling. Custom styles can be added to `App.css` or component-specific CSS files.

## Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a traffic optimization research system. Please refer to the main project documentation for licensing information.

## Support

For technical support or questions about the traffic optimization system, please refer to the comprehensive documentation provided with the system.

## Related Files

- `traffic_optimizer.py`: Core optimization algorithms
- `Traffic_Optimization_System_Documentation.md`: Complete technical documentation
- `research_findings.md`: Literature review and background research
- `mathematical_model.md`: Mathematical formulation and problem definition

