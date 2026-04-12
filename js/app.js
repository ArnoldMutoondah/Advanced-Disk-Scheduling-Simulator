import { executeFCFS, executeSSTF, executeSCAN, executeCSCAN } from './algorithms.js';

// Color Mapping matching CSS
const algoColors = {
    fcfs: '#ff6b6b',
    sstf: '#feca57',
    scan: '#48dbfb',
    cscan: '#1dd1a1'
};

// Global Chart references for destruction
let simChartInst = null;
let compChartInst = null;

// Page Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Active states
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Show page
        const targetId = e.currentTarget.getAttribute('data-target');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        // Re-render chart if it's there (sometimes canvas needs resize toggle)
        if(targetId === 'simulator-page' && simChartInst) simChartInst.update();
        if(targetId === 'comparison-page' && compChartInst) compChartInst.update();
    });
});

// Show/Hide Direction Dropdown based on Algo
document.getElementById('algoSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if(val === 'scan' || val === 'cscan') {
        document.getElementById('directionGroup').style.display = 'block';
    } else {
        document.getElementById('directionGroup').style.display = 'none';
    }
});

// Input parsing utility
function parseInput() {
    const totalCyl = parseInt(document.getElementById('totalCyl').value, 10);
    const initHead = parseInt(document.getElementById('initHead').value, 10);
    const reqSeqStr = document.getElementById('reqSeq').value;
    const algo = document.getElementById('algoSelect').value;
    const direction = document.getElementById('dirSelect').value;

    const errorEl = document.getElementById('seqError');
    errorEl.style.display = 'none';

    if(isNaN(totalCyl) || totalCyl <= 0) return { error: "Invalid Total Cylinders" };
    if(isNaN(initHead) || initHead < 0 || initHead >= totalCyl) return { error: "Invalid Initial Head Position" };
    
    // Parse seq
    let reqs = reqSeqStr.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
    if(reqs.some(isNaN)) {
        return { error: "Sequence must be comma separated numbers" };
    }
    
    // Check out of bounds
    if(reqs.some(r => r < 0 || r >= totalCyl)) {
        return { error: `All requests must be between 0 and ${totalCyl - 1}` };
    }

    return { totalCyl, initHead, reqs, algo, direction };
}

function runAlgorithm(algoId, reqs, initHead, totalCyl, dir) {
    switch(algoId) {
        case 'fcfs': return executeFCFS(reqs, initHead);
        case 'sstf': return executeSSTF(reqs, initHead);
        case 'scan': return executeSCAN(reqs, initHead, totalCyl, dir);
        case 'cscan': return executeCSCAN(reqs, initHead, totalCyl, dir);
        default: return executeFCFS(reqs, initHead);
    }
}

// Chart Maker Utils
function createChart(ctx, datasets, totalCyl) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: Math.max(...datasets.map(d => d.data.length))}, (_, i) => i),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            elements: {
                point: { radius: 5, hoverRadius: 8 },
                line: { tension: 0.3, borderWidth: 3 }
            },
            scales: {
                y: {
                    min: 0,
                    max: totalCyl - 1,
                    reverse: false,
                    title: { display: true, text: 'Track / Cylinder', color: '#c5c6c7' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#c5c6c7' }
                },
                x: {
                    title: { display: true, text: 'Sequence Step', color: '#c5c6c7' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#c5c6c7' }
                }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}

// Single Simulator Run
document.getElementById('simForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = parseInput();
    const errorEl = document.getElementById('seqError');
    if(data.error) {
        errorEl.textContent = data.error;
        errorEl.style.display = 'block';
        return;
    }

    const { totalCyl, initHead, reqs, algo, direction } = data;
    const result = runAlgorithm(algo, reqs, initHead, totalCyl, direction);

    // Update Metrics Dashboard
    document.getElementById('mTotalSeek').textContent = result.totalSeekTime;
    document.getElementById('mAvgSeek').textContent = result.averageSeekTime.toFixed(2);

    // Timeline Table
    const tbody = document.querySelector('#timelineTable tbody');
    tbody.innerHTML = '';
    let currentHead = initHead;
    for(let i = 1; i < result.sequence.length; i++) {
        let nxt = result.sequence[i];
        let dist = Math.abs(nxt - currentHead);
        
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${i}</td><td>${nxt}</td><td>${dist}</td>`;
        tbody.appendChild(tr);
        currentHead = nxt;
    }

    // Chart
    if(simChartInst) simChartInst.destroy();
    const ctx = document.getElementById('simChart').getContext('2d');
    const dataset = {
        label: result.name,
        data: result.sequence,
        borderColor: algoColors[algo],
        backgroundColor: algoColors[algo],
    };
    simChartInst = createChart(ctx, [dataset], totalCyl);
});

// Load Sample dataset
window.loadSample = function() {
    document.getElementById('totalCyl').value = 200;
    document.getElementById('initHead').value = 53;
    document.getElementById('reqSeq').value = "98, 183, 37, 122, 14, 124, 65, 67";
    document.getElementById('algoSelect').value = "sstf";
    document.getElementById('directionGroup').style.display = "none";
};

// Comparison Run
document.getElementById('runCompareBtn').addEventListener('click', () => {
    const data = parseInput();
    const errorEl = document.getElementById('seqError'); // Wait, error message might be hidden if tab changed, we alert instead for comparison
    
    if(data.error) {
        alert(data.error);
        return;
    }

    const { totalCyl, initHead, reqs, direction } = data;
    
    const selectedAlgos = Array.from(document.querySelectorAll('.comp-algo:checked')).map(cb => cb.value);
    
    if(selectedAlgos.length === 0) {
        alert("Please select at least one algorithm to compare.");
        return;
    }

    let datasets = [];
    let resultsHtml = '';

    selectedAlgos.forEach(algo => {
        const res = runAlgorithm(algo, reqs, initHead, totalCyl, direction);
        
        datasets.push({
            label: res.name,
            data: res.sequence,
            borderColor: algoColors[algo],
            backgroundColor: algoColors[algo],
        });

        resultsHtml += `
            <div style="padding: 1rem; border-left: 3px solid ${algoColors[algo]}; background: rgba(0,0,0,0.2); border-radius: 4px;">
                <h4 style="color:${algoColors[algo]}; margin-bottom: 0.5rem;">${res.name}</h4>
                <p>Total Seek: <strong>${res.totalSeekTime}</strong> | Avg Seek: <strong>${res.averageSeekTime.toFixed(2)}</strong></p>
            </div>
        `;
    });

    document.getElementById('compResults').innerHTML = resultsHtml;

    if(compChartInst) compChartInst.destroy();
    const ctx = document.getElementById('compChart').getContext('2d');
    compChartInst = createChart(ctx, datasets, totalCyl);
});

// Init sample on load so chart isn't totally blank
window.addEventListener('DOMContentLoaded', () => {
    loadSample();
    // Pre-fire formulate to show some initial chart
    setTimeout(() => {
        document.getElementById('simForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 500);
});
