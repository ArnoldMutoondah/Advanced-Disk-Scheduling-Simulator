# Advanced Disk Scheduling Simulator 💾

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Tech Stack](https://img.shields.io/badge/tech-Vanilla_JS-yellow.svg)

A modern, highly interactive web application visualizing and comparing core Operating System disk scheduling algorithms. 

This educational simulator allows users to enter custom disk sequences effortlessly, track real-time disk head positioning, and review deeply analytic comparison metrics directly in the browser—built intentionally with pure Vanilla Web Technologies (HTML/JS/CSS) requiring **zero installation or server setup**.

## 🚀 Features

- **Algorithmic Simulation**: Supports 4 integral disk scheduling techniques.
  - **FCFS** (First Come First Serve)
  - **SSTF** (Shortest Seek Time First)
  - **SCAN** (Elevator: directional scanning)
  - **C-SCAN** (Circular SCAN)
- **Live Visuals**: Powered by `Chart.js` tracking head progression efficiently along paths matching standard OS literature diagrams.
- **Detailed Metrics**: Computes precise values for Total Seek Time, Average Seek Time, and Execution step-lists. 
- **Comparison Engine**: Stack different algorithms with the identical sequences overlayed simultaneously to find the most efficient scheduling logic dynamically.
- **Modern UI**: Full Dark Mode glassmorphic aesthetics, smooth micro-animations, and complete error handling validation logic.

## 📖 Algorithms Used

1. **FCFS (First Come First Serve)**
   - Services processes strictly in the sequence they arrived. 
   - Simple but risks substantial wild head swings causing high seek times.
2. **SSTF (Shortest Seek Time First)**
   - Always picks the nearest requested track from the current head. 
   - Drastically cuts wait averages, but poses risks of starving extreme edge tracks.
3. **SCAN (Elevator Algorithm)**
   - Sweeps from one end to another servicing requests, then reverses direction completely. 
   - Guarantees bounded wait times but forces moves to extremes even if devoid of requests.
4. **C-SCAN (Circular SCAN)**
   - Sweeps entirely in one direction, wraps around (jumps without reading) rapidly, and begins sweeping identically. Provides the most uniform waiting environment across disks.

## ⚙️ Installation & Usage

Because this leverages high-efficiency modern Vanilla ES6 JavaScript, the setup is instant. 
**No Node.js, `npm`, or backend servers are required.**

1. Clone the repository:
   ```bash
   git clone https://github.com/ArnoldMutoondah/Advanced-Disk-Scheduling-Simulator.git
   ```
2. Navigate into the directory and launch:
   ```bash
   cd Advanced-Disk-Scheduling-Simulator
   ```
3. Inside your File Explorer, simply **double-click** the `index.html` file.
   It will instantly spin up safely within your standard web browser.

## 🔮 Future Improvements

- Add robust exporting functionality to download chart execution images.
- Integration of `LOOK` and `C-LOOK` Scheduling Algorithms.
- Add dynamic speed controls for the simulation playback.

---
*Created for the CSE 316 Operating Systems course.*
