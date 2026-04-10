export function executeFCFS(requests, initialHead) {
    let sequence = [initialHead, ...requests];
    let totalSeekTime = 0;
    
    for (let i = 1; i < sequence.length; i++) {
        totalSeekTime += Math.abs(sequence[i] - sequence[i - 1]);
    }
    
    return {
        id: 'fcfs',
        name: 'FCFS',
        sequence: sequence,
        totalSeekTime: totalSeekTime,
        averageSeekTime: requests.length > 0 ? (totalSeekTime / requests.length) : 0,
        requestsServiced: requests.length
    };
}

export function executeSSTF(requests, initialHead) {
    let sequence = [initialHead];
    let reqs = [...requests];
    let totalSeekTime = 0;
    let currentHead = initialHead;
    
    while (reqs.length > 0) {
        let minDiff = Infinity;
        let minIdx = -1;
        
        for (let i = 0; i < reqs.length; i++) {
            let diff = Math.abs(reqs[i] - currentHead);
            if (diff < minDiff) {
                minDiff = diff;
                minIdx = i;
            }
        }
        
        totalSeekTime += minDiff;
        currentHead = reqs[minIdx];
        sequence.push(currentHead);
        reqs.splice(minIdx, 1);
    }
    
    return {
        id: 'sstf',
        name: 'SSTF',
        sequence: sequence,
        totalSeekTime: totalSeekTime,
        averageSeekTime: requests.length > 0 ? (totalSeekTime / requests.length) : 0,
        requestsServiced: requests.length
    };
}

export function executeSCAN(requests, initialHead, totalCylinders, direction = 'right') {
    let sequence = [initialHead];
    let totalSeekTime = 0;
    
    let left = [];
    let right = [];
    
    for (let r of requests) {
        if (r < initialHead) left.push(r);
        if (r > initialHead) right.push(r);
    }
    
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
    
    // For SCAN, we also visit the end
    let run = 2;
    let currentHead = initialHead;
    let tempDir = direction;
    
    if (tempDir === 'left') {
        left.unshift(0); // goes to zero
    } else {
        right.push(totalCylinders - 1); // goes to max
    }
    
    for (let i = 0; i < run; i++) {
        if (tempDir === 'left') {
            for (let j = left.length - 1; j >= 0; j--) {
                sequence.push(left[j]);
                totalSeekTime += Math.abs(left[j] - currentHead);
                currentHead = left[j];
            }
            tempDir = 'right';
        } else {
            for (let j = 0; j < right.length; j++) {
                sequence.push(right[j]);
                totalSeekTime += Math.abs(right[j] - currentHead);
                currentHead = right[j];
            }
            tempDir = 'left';
        }
    }
    
    // Deduplicate consecutive elements (like if initialHead was in requests)
    sequence = sequence.filter((item, pos, arr) => pos === 0 || item !== arr[pos - 1]);
    
    return {
        id: 'scan',
        name: 'SCAN',
        sequence: sequence,
        totalSeekTime: totalSeekTime,
        averageSeekTime: requests.length > 0 ? (totalSeekTime / requests.length) : 0,
        requestsServiced: requests.length
    };
}

export function executeCSCAN(requests, initialHead, totalCylinders, direction = 'right') {
    let sequence = [initialHead];
    let totalSeekTime = 0;
    let currentHead = initialHead;
    
    let left = [];
    let right = [];
    
    for (let r of requests) {
        if (r < initialHead) left.push(r);
        if (r > initialHead) right.push(r);
    }
    
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
    
    left.unshift(0);
    right.push(totalCylinders - 1);
    
    if (direction === 'right') {
        for (let i = 0; i < right.length; i++) {
            sequence.push(right[i]);
            totalSeekTime += Math.abs(right[i] - currentHead);
            currentHead = right[i];
        }
        
        // Circular jump
        currentHead = 0;
        totalSeekTime += Math.abs(sequence[sequence.length - 1] - 0);
        sequence.push(0);
        
        for (let i = 0; i < left.length; i++) {
            if(left[i] !== 0) { // Already added 0
                sequence.push(left[i]);
                totalSeekTime += Math.abs(left[i] - currentHead);
                currentHead = left[i];
            }
        }
    } else {
        for (let i = left.length - 1; i >= 0; i--) {
            sequence.push(left[i]);
            totalSeekTime += Math.abs(left[i] - currentHead);
            currentHead = left[i];
        }
        
        // Circular jump
        currentHead = totalCylinders - 1;
        totalSeekTime += Math.abs(sequence[sequence.length - 1] - (totalCylinders - 1));
        sequence.push(totalCylinders - 1);
        
        for (let i = right.length - 1; i >= 0; i--) {
            if(right[i] !== totalCylinders - 1) { // Already added max
                sequence.push(right[i]);
                totalSeekTime += Math.abs(right[i] - currentHead);
                currentHead = right[i];
            }
        }
    }
    
    sequence = sequence.filter((item, pos, arr) => pos === 0 || item !== arr[pos - 1]);
    
    return {
        id: 'cscan',
        name: 'C-SCAN',
        sequence: sequence,
        totalSeekTime: totalSeekTime,
        averageSeekTime: requests.length > 0 ? (totalSeekTime / requests.length) : 0,
        requestsServiced: requests.length
    };
}
