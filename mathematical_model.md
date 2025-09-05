# Mathematical Model and NP-Complete Formulation for Traffic Light Optimization

## 1. Introduction

This document outlines the mathematical model and its NP-complete formulation for optimizing traffic light cycles and road speed limits. The primary objectives are to minimize the average velocity of vehicles and the car stop rate within a given road network. The model leverages available data, including GIS polylines for road information, traffic light locations, and vehicle count data at various points.

## 2. Problem Definition

The traffic light optimization problem aims to determine optimal traffic light cycle lengths (red, yellow, green phases) and maximum speed limits for each road segment. This optimization seeks to achieve two main goals:

1.  **Maximize Average Velocity:** Ensure smooth traffic flow and minimize travel time across the network.
2.  **Minimize Car Stop Rate:** Reduce instances of vehicles stopping at traffic lights, thereby improving fuel efficiency and reducing congestion.

## 3. Input Data

The following data inputs are available for the model:

-   **Road Network Information:** Provided as GIS polylines, including:
    -   Road segments (edges in a graph).
    -   Length of each road segment.
-   **Traffic Light Locations:** Specific nodes within the road network where traffic lights are present.
-   **Vehicle Count Data:** Historical or real-time data on the number of vehicles passing through specific points (e.g., traffic light intersections).

## 4. Decision Variables

To optimize the traffic flow, the following decision variables need to be determined:

-   **Traffic Light Cycle Phases:** For each traffic light `i` and each approach `j` (e.g., North, South, East, West), the duration of:
    -   `G_ij`: Green light phase duration (seconds)
    -   `Y_ij`: Yellow light phase duration (seconds)
    -   `R_ij`: Red light phase duration (seconds)
    The sum `G_ij + Y_ij + R_ij` defines the total cycle length for that approach.
-   **Maximum Speed Limit:** For each road segment `k`:
    -   `S_k`: Maximum allowed speed (e.g., km/h or mph)

## 5. Objective Functions

The optimization problem involves two primary objective functions:

### 5.1. Minimize Average Velocity

This objective aims to minimize the average travel time for vehicles across the entire network. It can be formulated as:

`Minimize Σ (Travel_Time_v)` for all vehicles `v`

Where `Travel_Time_v` is the total time taken by vehicle `v` to traverse its path through the network. This is inversely related to average velocity. A lower travel time implies a higher average velocity.

### 5.2. Minimize Car Stop Rate

This objective aims to minimize the number of times vehicles come to a complete stop at traffic lights. This can be formulated as:

`Minimize Σ (Number_of_Stops_v)` for all vehicles `v`

Where `Number_of_Stops_v` is the count of full stops made by vehicle `v` at traffic light intersections.

These two objectives can be combined into a single objective function using a weighted sum approach, or handled as a multi-objective optimization problem.

## 6. Constraints

The optimization must adhere to several constraints:

-   **Cycle Length Constraints:** For each traffic light `i` and approach `j`:
    -   `G_ij_min ≤ G_ij ≤ G_ij_max`
    -   `Y_ij_min ≤ Y_ij ≤ Y_ij_max`
    -   `R_ij_min ≤ R_ij ≤ R_ij_max`
    -   `G_ij + Y_ij + R_ij = Cycle_Length_i` (total cycle length for traffic light `i`)
-   **Phase Sequence Constraints:** Ensure proper sequencing of green, yellow, and red phases.
-   **Traffic Flow Conservation:** The number of vehicles entering an intersection must equal the number of vehicles leaving it (minus any turns or exits).
-   **Capacity Constraints:** Road segments and intersections have a maximum vehicle capacity.
-   **Speed Limit Constraints:** For each road segment `k`:
    -   `S_k_min ≤ S_k ≤ S_k_max`
-   **Safety Constraints:** Ensure sufficient yellow and all-red intervals for safety.

## 7. NP-Complete Formulation

The traffic light optimization problem, particularly when considering dynamic traffic flows and multiple objectives, is known to be NP-complete. This complexity arises from:

-   **Interdependencies:** The optimal timing of one traffic light significantly impacts the flow and optimal timing of adjacent traffic lights.
-   **Combinatorial Explosion:** As the number of intersections and road segments increases, the number of possible combinations of cycle timings and speed limits grows exponentially.
-   **Dynamic Nature:** Traffic flow is inherently dynamic, influenced by real-time vehicle arrivals, driver behavior, and unforeseen events.

Specifically, the **Green Light Optimal Velocity (GLOV) Problem** with binary speed choices has been proven to be NP-complete [1]. This problem, which seeks to enable vehicles to pass through intersections without stopping, is a sub-problem or a closely related problem to the overall traffic light optimization. The fixed-time traffic control problem has also been shown to be NP-complete [4].

To address the NP-completeness, exact solutions are often computationally infeasible for large-scale networks. Therefore, heuristic algorithms, approximation algorithms, or metaheuristics (such as Genetic Algorithms, Simulated Annealing, or Reinforcement Learning) are typically employed to find near-optimal solutions within a reasonable time frame.

## 8. References

[1] Complexity Analysis of Green Light Optimal Velocity Problem: An NP-complete Result for Binary Speed Choices. Available at: [https://www.researchgate.net/publication/277639791_Complexity_Analysis_of_Green_Light_Optimal_Velocity_Problem_An_NP-complete_Result_for_Binary_Speed_Choices](https://www.researchgate.net/publication/277639791_Complexity_Analysis_of_Green_Light_Optimal_Velocity_Problem_An_NP-complete_Result_for_Binary_Speed_Choices)

[4] A mathematical model for the fixed-time traffic control problem. Available at: [https://www.sciencedirect.com/science/article/abs/pii/0377221789903184](https://www.sciencedirect.com/science/article/abs/pii/0377221789903184)




## 9. Network Representation

The road network can be represented as a directed graph `G = (V, E)`, where:

-   `V` is the set of nodes, representing intersections and road endpoints.
-   `E` is the set of directed edges, representing road segments. Each edge `e ∈ E` connects two nodes `u, v ∈ V` and has attributes such as length `L_e` (from GIS polylines) and capacity `C_e`.

Traffic lights are located at specific nodes (intersections) in `V`. Each traffic light `i` controls a set of incoming edges `E_i_in` and outgoing edges `E_i_out`.

## 10. Detailed Objective Function Formulation

### 10.1. Minimizing Average Velocity (Maximizing Average Speed)

To minimize average velocity, we effectively want to maximize the average speed of vehicles. The average speed of a vehicle `v` traversing a path `P_v = (e_1, e_2, ..., e_m)` (a sequence of road segments) can be expressed as:

`Average_Speed_v = Total_Distance_v / Total_Time_v`

Where `Total_Distance_v = Σ L_e` for all `e ∈ P_v`.

`Total_Time_v = Σ (Travel_Time_e + Delay_Time_e)` for all `e ∈ P_v`

-   `Travel_Time_e`: Time taken to traverse road segment `e` at its effective speed, considering the optimized speed limit `S_e`.
    `Travel_Time_e = L_e / S_e`
-   `Delay_Time_e`: Time spent waiting at traffic lights at the end of segment `e`.

Our objective is to minimize the sum of `Total_Time_v` for all vehicles, or equivalently, maximize the average speed across the network. This can be formulated as:

`Minimize Σ_v (Σ_e∈P_v (L_e / S_e + Delay_Time_e))`

The `Delay_Time_e` is a function of the traffic light cycle timings (`G_ij`, `Y_ij`, `R_ij`) and the arrival patterns of vehicles at the intersection. This is where the vehicle count data becomes crucial. We can estimate arrival rates based on historical counts and model the queuing and delay at intersections.

### 10.2. Minimizing Car Stop Rate

Minimizing the car stop rate is closely related to minimizing delays. A stop occurs when a vehicle arrives at a red light and has to wait. This can be modeled by penalizing each stop. The number of stops can be estimated by analyzing the traffic light timings and the flow of vehicles. For a given traffic light `i` and an incoming approach `j`, the number of stops can be approximated by:

`Number_of_Stops_ij = f(Arrival_Rate_ij, G_ij, Y_ij, R_ij)`

Where `Arrival_Rate_ij` is the rate at which vehicles arrive at traffic light `i` from approach `j`, derived from the vehicle count data. The function `f` would typically involve queuing theory models (e.g., D/D/1 queuing model for deterministic arrivals and departures, or M/M/1 for stochastic arrivals and departures) to calculate the number of vehicles that are forced to stop during a red phase.

The objective function for minimizing car stops would then be:

`Minimize Σ_i Σ_j Number_of_Stops_ij`

## 11. Integration of Input Data

-   **GIS Polylines with Lengths:** These directly provide the `L_e` values for each edge `e` in the graph `G`. They also define the topology of the network (nodes and edges).
-   **Traffic Light Locations:** These identify the specific nodes in `V` where traffic lights are present and where the cycle phase variables (`G_ij`, `Y_ij`, `R_ij`) apply.
-   **Vehicle Count Data:** This data is essential for estimating `Arrival_Rate_ij` for each approach to a traffic light. This can be used to calibrate traffic flow models and predict vehicle arrivals, which in turn influences the `Delay_Time_e` and `Number_of_Stops_ij` calculations.

## 12. NP-Completeness and Solution Approaches

Given the NP-complete nature of the problem, exact solutions are generally not feasible for real-world traffic networks. Therefore, the solution will involve metaheuristic or approximation algorithms. Potential approaches include:

-   **Genetic Algorithms (GA):** GAs can explore a large search space of cycle timings and speed limits, iteratively improving solutions based on the objective functions. The fitness function would be derived from the combined objective of minimizing average travel time and car stops.
-   **Simulated Annealing:** This probabilistic metaheuristic can be used to find a good approximation to the global optimum of a given function in a large search space.
-   **Reinforcement Learning (RL):** For dynamic optimization, RL agents can learn optimal policies for traffic light control by interacting with a simulated traffic environment and receiving rewards based on traffic flow metrics.

The choice of algorithm will depend on the scale of the problem, computational resources, and the desired trade-off between solution quality and computation time.

## 13. Feedback to Drivers (Optimized Maximum Speed)

The optimized maximum speed for every road segment (`S_k`) is a direct output of the model. This information can be fed back to drivers, potentially through navigation systems or intelligent road signs, to encourage smoother traffic flow and reduce unnecessary stops. This forms a crucial part of the feedback loop to achieve the maximum average velocity and minimum car stop rate.


