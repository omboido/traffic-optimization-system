
import networkx as nx
import random

class TrafficNetwork:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.traffic_lights = {}
        self.vehicle_counts = {}

    def load_gis_data(self, gis_data):
        # Placeholder for loading GIS data (polylines with lengths)
        # gis_data would be a list of dictionaries, e.g.,
        # [{'from': 'A', 'to': 'B', 'length': 100, 'speed_limit': 60}]
        for segment in gis_data:
            self.graph.add_edge(segment['from'], segment['to'], length=segment['length'], speed_limit=segment.get('speed_limit', 50))

    def load_traffic_light_locations(self, light_locations):
        # Placeholder for loading traffic light locations
        # light_locations would be a dictionary, e.g.,
        # {'B': {'approaches': ['A', 'C'], 'cycle_phases': {'A': {'green': 30, 'yellow': 3, 'red': 27}}}}
        self.traffic_lights = light_locations

    def load_vehicle_count_data(self, count_data):
        # Placeholder for loading vehicle count data
        # count_data would be a dictionary, e.g.,
        # {'B': {'A': 100, 'C': 80}} (vehicles from A to B, C to B)
        self.vehicle_counts = count_data

    def get_approaches_for_light(self, light_node):
        # Returns incoming edges to a traffic light node
        return list(self.graph.predecessors(light_node))

class TrafficSimulator:
    def __init__(self, network):
        self.network = network

    def calculate_travel_time(self, path, speed_limits, traffic_light_cycles):
        total_time = 0
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            edge_data = self.network.graph.get_edge_data(u, v)
            if edge_data:
                length = edge_data['length']
                speed_limit = speed_limits.get((u, v), edge_data['speed_limit'])
                travel_time_segment = length / (speed_limit / 3.6) # Convert km/h to m/s for consistency with length in meters
                total_time += travel_time_segment

                # Add delay at traffic lights
                if v in self.network.traffic_lights:
                    # Simplified delay calculation: assume uniform arrival and fixed cycle
                    # This is a very basic model, needs to be improved for accuracy
                    light_info = self.network.traffic_lights[v]
                    if u in light_info['cycle_phases']:
                        phase = light_info['cycle_phases'][u]
                        cycle_length = phase['green'] + phase['yellow'] + phase['red']
                        # Average delay at a red light (assuming random arrival)
                        # This is a simplification; actual delay depends on arrival time within cycle
                        average_red_time = phase['red']
                        total_time += average_red_time * 0.5 # Average wait is half of red phase
            else:
                print(f"Warning: Edge ({u}, {v}) not found in graph.")
                return float('inf') # Indicate invalid path
        return total_time

    def calculate_stops(self, path, traffic_light_cycles):
        stops = 0
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            if v in self.network.traffic_lights:
                # Simplified stop calculation: assume a stop if light is red on arrival
                # This needs to be more sophisticated, considering arrival time and cycle
                light_info = self.network.traffic_lights[v]
                if u in light_info['cycle_phases']:
                    phase = light_info['cycle_phases'][u]
                    # For simplicity, if red phase exists, assume potential for stop
                    if phase['red'] > 0:
                        stops += 1 # This is a very rough estimate
        return stops

    def evaluate_solution(self, speed_limits, traffic_light_cycles):
        # This function would simulate traffic flow and calculate metrics
        # For now, let's use a simplified approach based on paths
        total_travel_time = 0
        total_stops = 0
        num_vehicles = 0

        # Example: Simulate vehicles traversing random paths
        # In a real scenario, this would come from actual traffic demand models
        nodes = list(self.network.graph.nodes())
        for _ in range(100): # Simulate 100 vehicles
            try:
                start_node = random.choice(nodes)
                end_node = random.choice(nodes)
                if start_node == end_node: continue

                # Find a simple path (for demonstration)
                path = nx.shortest_path(self.network.graph, source=start_node, target=end_node, weight='length')
                
                travel_time = self.calculate_travel_time(path, speed_limits, traffic_light_cycles)
                stops = self.calculate_stops(path, traffic_light_cycles)

                total_travel_time += travel_time
                total_stops += stops
                num_vehicles += 1
            except nx.NetworkXNoPath:
                continue # No path between nodes
            except Exception as e:
                print(f"Error during simulation: {e}")
                continue

        if num_vehicles == 0: return float('inf'), float('inf')

        average_velocity = (sum(self.network.graph.get_edge_data(path[i], path[i+1])['length'] for i in range(len(path)-1)) / total_travel_time) if total_travel_time > 0 else 0
        average_stops = total_stops / num_vehicles

        return average_velocity, average_stops

class TrafficOptimizer:
    def __init__(self, network, simulator):
        self.network = network
        self.simulator = simulator

    def genetic_algorithm_optimize(self, generations=50, population_size=10, mutation_rate=0.1):
        # Simplified Genetic Algorithm for demonstration

        # Initialize population (random speed limits and traffic light cycles)
        population = []
        for _ in range(population_size):
            individual_speed_limits = {}
            for u, v, data in self.network.graph.edges(data=True):
                individual_speed_limits[(u, v)] = random.uniform(30, 100) # Random speed between 30-100 km/h

            individual_traffic_light_cycles = {}
            for light_node, light_info in self.network.traffic_lights.items():
                individual_traffic_light_cycles[light_node] = {}
                for approach in light_info['approaches']:
                    # Ensure total cycle length is reasonable, e.g., 60-120 seconds
                    green = random.uniform(20, 60)
                    yellow = random.uniform(2, 5)
                    red = random.uniform(20, 60)
                    individual_traffic_light_cycles[light_node][approach] = {'green': green, 'yellow': yellow, 'red': red}
            population.append((individual_speed_limits, individual_traffic_light_cycles))

        best_solution = None
        best_avg_velocity = -float('inf')
        best_avg_stops = float('inf')

        for generation in range(generations):
            print(f"Generation {generation + 1}/{generations}")
            # Evaluate population
            evaluated_population = []
            for speed_limits, cycles in population:
                avg_velocity, avg_stops = self.simulator.evaluate_solution(speed_limits, cycles)
                # Objective: Maximize avg_velocity, Minimize avg_stops
                # Combine into a single fitness score (needs careful weighting)
                fitness = avg_velocity - avg_stops * 0.1 # Example weighting
                evaluated_population.append((fitness, speed_limits, cycles))

            evaluated_population.sort(key=lambda x: x[0], reverse=True)

            current_best_fitness, current_best_speed_limits, current_best_cycles = evaluated_population[0]
            current_avg_velocity, current_avg_stops = self.simulator.evaluate_solution(current_best_speed_limits, current_best_cycles)

            if current_avg_velocity > best_avg_velocity or \
               (current_avg_velocity == best_avg_velocity and current_avg_stops < best_avg_stops):
                best_avg_velocity = current_avg_velocity
                best_avg_stops = current_avg_stops
                best_solution = (current_best_speed_limits, current_best_cycles)

            # Selection (elitism + roulette wheel/tournament)
            selected = evaluated_population[:population_size // 2] # Elitism: take top half

            # Crossover and Mutation to create new generation
            next_population = []
            while len(next_population) < population_size:
                parent1_speed, parent1_cycles = random.choice(selected)[1:]
                parent2_speed, parent2_cycles = random.choice(selected)[1:]

                # Crossover for speed limits
                child_speed = {}
                for k in parent1_speed:
                    child_speed[k] = random.choice([parent1_speed[k], parent2_speed[k]])

                # Crossover for traffic light cycles
                child_cycles = {}
                for light_node in parent1_cycles:
                    child_cycles[light_node] = {}
                    for approach in parent1_cycles[light_node]:
                        child_cycles[light_node][approach] = {
                            'green': random.choice([parent1_cycles[light_node][approach]['green'], parent2_cycles[light_node][approach]['green']]),
                            'yellow': random.choice([parent1_cycles[light_node][approach]['yellow'], parent2_cycles[light_node][approach]['yellow']]),
                            'red': random.choice([parent1_cycles[light_node][approach]['red'], parent2_cycles[light_node][approach]['red']])
                        }

                # Mutation
                for k in child_speed:
                    if random.random() < mutation_rate:
                        child_speed[k] = random.uniform(30, 100)

                for light_node in child_cycles:
                    for approach in child_cycles[light_node]:
                        if random.random() < mutation_rate:
                            child_cycles[light_node][approach]['green'] = random.uniform(20, 60)
                        if random.random() < mutation_rate:
                            child_cycles[light_node][approach]['yellow'] = random.uniform(2, 5)
                        if random.random() < mutation_rate:
                            child_cycles[light_node][approach]['red'] = random.uniform(20, 60)
                
                next_population.append((child_speed, child_cycles))
            population = next_population

        return best_solution, best_avg_velocity, best_avg_stops

# --- Example Usage ---
if __name__ == "__main__":
    # 1. Initialize Network
    network = TrafficNetwork()

    # Placeholder GIS Data
    gis_data = [
        {'from': 'A', 'to': 'B', 'length': 500},
        {'from': 'B', 'to': 'C', 'length': 300},
        {'from': 'C', 'to': 'D', 'length': 700},
        {'from': 'D', 'to': 'A', 'length': 600},
        {'from': 'B', 'to': 'E', 'length': 400},
        {'from': 'E', 'to': 'C', 'length': 200},
    ]
    network.load_gis_data(gis_data)

    # Placeholder Traffic Light Locations and initial cycles
    # 'B' and 'C' are intersections with traffic lights
    traffic_light_locations = {
        'B': {
            'approaches': ['A', 'E'], # Roads leading to B
            'cycle_phases': {
                'A': {'green': 30, 'yellow': 3, 'red': 27},
                'E': {'green': 30, 'yellow': 3, 'red': 27}
            }
        },
        'C': {
            'approaches': ['B', 'E'], # Roads leading to C
            'cycle_phases': {
                'B': {'green': 30, 'yellow': 3, 'red': 27},
                'E': {'green': 30, 'yellow': 3, 'red': 27}
            }
        }
    }
    network.load_traffic_light_locations(traffic_light_locations)

    # Placeholder Vehicle Count Data (e.g., daily counts)
    vehicle_count_data = {
        'B': {'A': 1000, 'E': 800},
        'C': {'B': 1200, 'E': 900}
    }
    network.load_vehicle_count_data(vehicle_count_data)

    # 2. Initialize Simulator and Optimizer
    simulator = TrafficSimulator(network)
    optimizer = TrafficOptimizer(network, simulator)

    # 3. Run Optimization
    print("Starting genetic algorithm optimization...")
    best_solution, best_avg_velocity, best_avg_stops = optimizer.genetic_algorithm_optimize(
        generations=10, # Reduced for quick demonstration
        population_size=5 # Reduced for quick demonstration
    )

    print("\nOptimization Complete!")
    if best_solution:
        optimized_speed_limits, optimized_traffic_light_cycles = best_solution
        print("\nOptimized Speed Limits (km/h):")
        for (u, v), speed in optimized_speed_limits.items():
            print(f"  Road {u}-{v}: {speed:.2f} km/h")

        print("\nOptimized Traffic Light Cycles (seconds):")
        for light_node, approaches in optimized_traffic_light_cycles.items():
            print(f"  Traffic Light at {light_node}:")
            for approach, phases in approaches.items():
                print(f"    Approach from {approach}: Green={phases['green']:.2f}, Yellow={phases['yellow']:.2f}, Red={phases['red']:.2f}")

        print(f"\nBest Average Velocity: {best_avg_velocity:.2f} m/s")
        print(f"Best Average Stops per Vehicle: {best_avg_stops:.2f}")
    else:
        print("No optimal solution found.")

# --- Enhancements for TrafficSimulator (More Realistic Modeling) ---

class EnhancedTrafficSimulator(TrafficSimulator):
    def calculate_delay_at_light(self, arrival_rate, green_time, yellow_time, red_time):
        # Using a simplified M/D/1 queuing model for average delay at a signalized intersection
        # This is still a simplification, but better than just half of red time
        # Assumes vehicles arrive at a constant rate during the cycle
        cycle_length = green_time + yellow_time + red_time
        if cycle_length == 0: return 0

        # Effective green time (considering lost time for yellow/all-red)
        effective_green = green_time + yellow_time # Assuming yellow is part of effective green for flow

        # Saturation flow rate (vehicles per unit time during green) - assume 1 vehicle per 2 seconds for simplicity
        # This would ideally be calibrated with real data
        saturation_flow_rate = 0.5 # vehicles per second

        # Degree of saturation (traffic intensity)
        if effective_green == 0: return float("inf") # No green time, infinite delay
        x = arrival_rate * cycle_length / (saturation_flow_rate * effective_green)

        if x >= 1: return float("inf") # Congested, infinite delay

        # Average delay per vehicle (Webster's formula approximation for uniform arrivals)
        # d = (C * (1-g/C)^2) / (2 * (1 - (g/C) * x)) + (x^2) / (2 * q * (1-x))
        # Simplified version for average delay at a pre-timed signal
        # This is a very basic approximation and doesn't account for platooning, etc.
        delay = (0.5 * cycle_length * (1 - effective_green / cycle_length)**2) / (1 - (effective_green / cycle_length) * x)
        return delay

    def calculate_travel_time(self, path, speed_limits, traffic_light_cycles):
        total_time = 0
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            edge_data = self.network.graph.get_edge_data(u, v)
            if edge_data:
                length = edge_data["length"]
                speed_limit = speed_limits.get((u, v), edge_data["speed_limit"])
                travel_time_segment = length / (speed_limit / 3.6) # Convert km/h to m/s
                total_time += travel_time_segment

                # Add delay at traffic lights if 'v' is a traffic light node
                if v in self.network.traffic_lights:
                    light_info = self.network.traffic_lights[v]
                    # Find the approach corresponding to the current segment (u -> v)
                    approach_key = u # Assuming 'u' is the approach node

                    if approach_key in light_info["cycle_phases"]:
                        phase = light_info["cycle_phases"][approach_key]
                        green = phase["green"]
                        yellow = phase["yellow"]
                        red = phase["red"]

                        # Estimate arrival rate for this approach
                        # This is a very rough estimate; ideally, it comes from dynamic simulation
                        arrival_rate = self.network.vehicle_counts.get(v, {}).get(approach_key, 0) / 3600 # vehicles per second

                        delay = self.calculate_delay_at_light(arrival_rate, green, yellow, red)
                        total_time += delay
            else:
                return float("inf") # Invalid path
        return total_time

    def calculate_stops(self, path, speed_limits, traffic_light_cycles):
        stops = 0
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            if v in self.network.traffic_lights:
                light_info = self.network.traffic_lights[v]
                approach_key = u

                if approach_key in light_info["cycle_phases"]:
                    phase = light_info["cycle_phases"][approach_key]
                    green = phase["green"]
                    yellow = phase["yellow"]
                    red = phase["red"]

                    # A stop is likely if a vehicle arrives during the red phase
                    # This is a probabilistic approach based on cycle times
                    cycle_length = green + yellow + red
                    if cycle_length > 0:
                        prob_of_red = red / cycle_length
                        # Assuming uniform arrival, probability of stopping is prob_of_red
                        # For a more accurate model, this would involve vehicle arrival times
                        if random.random() < prob_of_red: # Simulate if a stop occurs
                            stops += 1
        return stops

    def evaluate_solution(self, speed_limits, traffic_light_cycles):
        total_travel_time = 0
        total_stops = 0
        num_vehicles = 0

        nodes = list(self.network.graph.nodes())
        for _ in range(200): # Simulate more vehicles for better average
            try:
                start_node = random.choice(nodes)
                end_node = random.choice(nodes)
                if start_node == end_node: continue

                # Find a simple path (for demonstration)
                path = nx.shortest_path(self.network.graph, source=start_node, target=end_node, weight='length')
                
                travel_time = self.calculate_travel_time(path, speed_limits, traffic_light_cycles)
                stops = self.calculate_stops(path, speed_limits, traffic_light_cycles) # Pass speed_limits and cycles

                if travel_time != float('inf'): # Only consider valid paths
                    total_travel_time += travel_time
                    total_stops += stops
                    num_vehicles += 1
            except nx.NetworkXNoPath:
                continue
            except Exception as e:
                # print(f"Error during simulation: {e}") # Uncomment for debugging
                continue

        if num_vehicles == 0: return 0, 0 # Avoid division by zero

        # Calculate average velocity for all simulated paths
        total_distance = 0
        for _ in range(200): # Recalculate total distance for average velocity
            try:
                start_node = random.choice(nodes)
                end_node = random.choice(nodes)
                if start_node == end_node: continue
                path = nx.shortest_path(self.network.graph, source=start_node, target=end_node, weight='length')
                for i in range(len(path) - 1):
                    u, v = path[i], path[i+1]
                    edge_data = self.network.graph.get_edge_data(u, v)
                    if edge_data: total_distance += edge_data["length"]
            except nx.NetworkXNoPath:
                continue
            except Exception as e:
                continue

        average_velocity = (total_distance / total_travel_time) if total_travel_time > 0 else 0
        average_stops = total_stops / num_vehicles

        return average_velocity, average_stops

def generate_sample_gis_data(num_nodes=10, num_edges=20):
    nodes = [chr(ord('A') + i) for i in range(num_nodes)]
    gis_data = []
    for _ in range(num_edges):
        u = random.choice(nodes)
        v = random.choice(nodes)
        if u != v and not network.graph.has_edge(u, v):
            length = random.randint(100, 1000) # meters
            speed_limit = random.randint(30, 90) # km/h
            gis_data.append({'from': u, 'to': v, 'length': length, 'speed_limit': speed_limit})
    return gis_data

def generate_sample_traffic_light_locations(network_graph, num_lights=2):
    traffic_light_locations = {}
    possible_light_nodes = [node for node in network_graph.nodes() if network_graph.in_degree(node) > 1 and network_graph.out_degree(node) > 1]
    
    # Ensure we don't try to create more lights than possible nodes
    num_lights = min(num_lights, len(possible_light_nodes))

    selected_light_nodes = random.sample(possible_light_nodes, num_lights)

    for light_node in selected_light_nodes:
        approaches = list(network_graph.predecessors(light_node))
        cycle_phases = {}
        for approach in approaches:
            green = random.randint(20, 60)
            yellow = random.randint(2, 5)
            red = random.randint(20, 60)
            cycle_phases[approach] = {'green': green, 'yellow': yellow, 'red': red}
        traffic_light_locations[light_node] = {'approaches': approaches, 'cycle_phases': cycle_phases}
    return traffic_light_locations

def generate_sample_vehicle_count_data(traffic_light_locations, avg_daily_count=1000):
    vehicle_count_data = {}
    for light_node, light_info in traffic_light_locations.items():
        vehicle_count_data[light_node] = {}
        for approach in light_info['approaches']:
            # Vary counts slightly around the average
            count = max(100, int(avg_daily_count * random.uniform(0.8, 1.2)))
            vehicle_count_data[light_node][approach] = count
    return vehicle_count_data

# Modify the main execution block to use generated data
if __name__ == "__main__":
    network = TrafficNetwork()

    # Generate sample data
    gis_data = generate_sample_gis_data(num_nodes=8, num_edges=15) # Smaller network for faster testing
    network.load_gis_data(gis_data)

    traffic_light_locations = generate_sample_traffic_light_locations(network.graph, num_lights=2)
    network.load_traffic_light_locations(traffic_light_locations)

    vehicle_count_data = generate_sample_vehicle_count_data(traffic_light_locations)
    network.load_vehicle_count_data(vehicle_count_data)

    # Print generated data for verification
    print("\n--- Generated GIS Data ---")
    for segment in gis_data:
        print(f"  {segment['from']}->{segment['to']}: Length={segment['length']}m, SpeedLimit={segment['speed_limit']}km/h")

    print("\n--- Generated Traffic Light Locations ---")
    for light_node, info in traffic_light_locations.items():
        print(f"  Light at {light_node}: Approaches={info['approaches']}")
        for approach, phases in info['cycle_phases'].items():
            print(f"    Approach {approach}: Green={phases['green']}, Yellow={phases['yellow']}, Red={phases['red']}")

    print("\n--- Generated Vehicle Count Data ---")
    for light_node, counts in vehicle_count_data.items():
        print(f"  Light at {light_node}: {counts}")

    # 2. Initialize Simulator and Optimizer
    simulator = EnhancedTrafficSimulator(network)
    optimizer = TrafficOptimizer(network, simulator)

    # 3. Run Optimization
    print("\nStarting genetic algorithm optimization...")
    best_solution, best_avg_velocity, best_avg_stops = optimizer.genetic_algorithm_optimize(
        generations=5, # Further reduced for quick testing of data generation
        population_size=3 # Further reduced for quick testing of data generation
    )

    print("\nOptimization Complete!")
    if best_solution:
        optimized_speed_limits, optimized_traffic_light_cycles = best_solution
        print("\nOptimized Speed Limits (km/h):")
        for (u, v), speed in optimized_speed_limits.items():
            print(f"  Road {u}-{v}: {speed:.2f} km/h")

        print("\nOptimized Traffic Light Cycles (seconds):")
        for light_node, approaches in optimized_traffic_light_cycles.items():
            print(f"  Traffic Light at {light_node}:")
            for approach, phases in approaches.items():
                print(f"    Approach from {approach}: Green={phases['green']:.2f}, Yellow={phases['yellow']:.2f}, Red={phases['red']:.2f}")

        print(f"\nBest Average Velocity: {best_avg_velocity:.2f} m/s")
        print(f"Best Average Stops per Vehicle: {best_avg_stops:.2f}")
    else:
        print("No optimal solution found.")


