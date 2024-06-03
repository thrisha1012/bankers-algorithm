function generateInputFields() {
    const numProcesses = document.getElementById('numProcesses').value;
    const numResources = document.getElementById('numResources').value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = '';

    for (let i = 0; i < numProcesses; i++) {
        inputFields.innerHTML += `<h3>Process ${i}</h3>`;
        inputFields.innerHTML += `<div class="input-group"><label for="max${i}">Max:</label><input type="text" id="max${i}" placeholder="e.g. 7 5 3"></div>`;
        inputFields.innerHTML += `<div class="input-group"><label for="alloc${i}">Allocation:</label><input type="text" id="alloc${i}" placeholder="e.g. 0 1 0"></div>`;
    }

    inputFields.innerHTML += `<h3>Available Resources</h3>`;
    inputFields.innerHTML += `<div class="input-group"><label for="avail">Available:</label><input type="text" id="avail" placeholder="e.g. 3 3 2"></div>`;
}

function parseInput(input, numResources) {
    return input.split(' ').map(Number).slice(0, numResources);
}

function checkSafeState(event) {
    event.preventDefault();
    
    const numProcesses = document.getElementById('numProcesses').value;
    const numResources = document.getElementById('numResources').value;

    let max = [], allocation = [], need = [];
    for (let i = 0; i < numProcesses; i++) {
        max.push(parseInput(document.getElementById(`max${i}`).value, numResources));
        allocation.push(parseInput(document.getElementById(`alloc${i}`).value, numResources));
    }

    const available = parseInput(document.getElementById('avail').value, numResources);

    for (let i = 0; i < numProcesses; i++) {
        need.push(max[i].map((m, j) => m - allocation[i][j]));
    }

    const finish = Array(numProcesses).fill(false);
    const safeSequence = [];
    let work = available.slice();

    function findProcess() {
        for (let i = 0; i < numProcesses; i++) {
            if (!finish[i] && need[i].every((n, j) => n <= work[j])) {
                return i;
            }
        }
        return null;
    }

    while (true) {
        const processIndex = findProcess();
        if (processIndex === null) break;
        
        work = work.map((w, j) => w + allocation[processIndex][j]);
        finish[processIndex] = true;
        safeSequence.push(processIndex);
    }

    const result = document.getElementById('result');
    if (finish.every(f => f)) {
        result.innerHTML = `System is in a safe state.<br>Safe sequence: ${safeSequence.join(' ')}`;
    } else {
        result.innerHTML = `System is not in a safe state.`;
    }
}
