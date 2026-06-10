// Dom Selectors
const ipInput = document.getElementById('ip-input');
const lookupBtn = document.getElementById('lookup-btn');

const dataIp = document.getElementById('data-ip');
const dataLocation = document.getElementById('data-location');
const dataIsp = document.getElementById('data-isp');
const dataMeta = document.getElementById('data-meta');

// 1. Core Fetch Function
async function fetchNetworkData(targetIp = '') {
    // Determine target URL path (empty string target defaults to current client device IP)
    const apiUrl = targetIp ? `https://ipapi.co/${targetIp}/json/` : `https://ipapi.co/json/`;
    
    // Set text element visual indicators to loading state
    setLoadingState();

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("Network package response drop.");
        }
        
        const data = await response.json();

        // Check if API specifically returned an error object structure
        if (data.error) {
            alert(`Scan Failed: ${data.reason || 'Invalid Target IP Structure.'}`);
            setEmptyState();
            return;
        }

        // 2. Render Received Data to Display Cards
        dataIp.innerText = data.ip || 'Unknown';
        dataIp.classList.remove('loading');

        dataLocation.innerHTML = `${data.city || 'N/A'}, <br>${data.region || 'N/A'}, <br>${data.country_name || 'N/A'}`;
        dataLocation.classList.remove('loading');

        dataIsp.innerText = data.org || 'Unknown Provider';
        dataIsp.classList.remove('loading');

        dataMeta.innerHTML = `TZ: ${data.timezone || 'N/A'} <br>CUR: ${data.currency || 'N/A'}`;
        dataMeta.classList.remove('loading');

    } catch (error) {
        console.error("Critical Fetch Fail: ", error);
        alert("Metadata scan timeout. Check connection parameters.");
        setEmptyState();
    }
}

// Visual layout helper routines
function setLoadingState() {
    const panels = [dataIp, dataLocation, dataIsp, dataMeta];
    panels.forEach(panel => {
        panel.innerText = "Scanning network...";
        panel.classList.add('loading');
    });
}

function setEmptyState() {
    const panels = [dataIp, dataLocation, dataIsp, dataMeta];
    panels.forEach(panel => {
        panel.innerText = "No Scan Targets Detected";
        panel.classList.remove('loading');
    });
}

// 3. User Trigger Connection Bindings
lookupBtn.addEventListener('click', () => {
    const cleanValue = ipInput.value.trim();
    fetchNetworkData(cleanValue);
});

// Capture "Enter" keypress events inside search fields
ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchNetworkData(ipInput.value.trim());
    }
});

// AUTO-RUN: Trigger instant self-lookup profile capture layout initialization
window.addEventListener('DOMContentLoaded', () => {
    fetchNetworkData();
});