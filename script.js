function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('dateDisplay').textContent = `${day}-${month}-${year}`;
    document.getElementById('timeDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

function updateBatteryUI(battery) {
    const percentage = Math.round(battery.level * 100);
    const isCharging = battery.charging;
    
    const percentageEl = document.getElementById('batteryPercentage');
    const fillEl = document.getElementById('batteryFill');
    const chargingIconEl = document.getElementById('chargingIcon');
    const chargingTextEl = document.getElementById('chargingText');
    
    percentageEl.textContent = `${percentage}%`;
    fillEl.style.width = `${percentage}%`;
    
    percentageEl.classList.remove('low', 'medium');
    fillEl.classList.remove('low', 'medium');
    
    if (percentage <= 20) {
        percentageEl.classList.add('low');
        fillEl.classList.add('low');
    } else if (percentage <= 50) {
        percentageEl.classList.add('medium');
        fillEl.classList.add('medium');
    }
    
    if (isCharging) {
        chargingIconEl.textContent = '⚡';
        chargingIconEl.className = 'charging-icon plugged';
        chargingTextEl.textContent = 'Plugged In - Charging';
    } else {
        chargingIconEl.textContent = '🔌';
        chargingIconEl.className = 'charging-icon unplugged';
        chargingTextEl.textContent = 'Not Plugged In';
    }
}

function handleBatteryError(message) {
    document.getElementById('batteryLoading').style.display = 'none';
    document.getElementById('batteryError').style.display = 'block';
    document.getElementById('batteryError').textContent = message;
}

async function initBattery() {
    document.getElementById('batteryLoading').style.display = 'block';
    document.getElementById('batteryInfo').style.display = 'none';
    document.getElementById('batteryError').style.display = 'none';
    
    if (!('getBattery' in navigator)) {
        handleBatteryError('Battery Status API is not supported in this browser. Please use a Chromium-based browser (Chrome, Edge, Opera) or Firefox.');
        return;
    }
    
    try {
        const battery = await navigator.getBattery();
        
        document.getElementById('batteryLoading').style.display = 'none';
        document.getElementById('batteryInfo').style.display = 'block';
        
        updateBatteryUI(battery);
        
        battery.addEventListener('levelchange', () => updateBatteryUI(battery));
        battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
        
    } catch (error) {
        handleBatteryError('Failed to access battery information. Please ensure the Battery Status API permissions are granted.');
    }
}

updateDateTime();
initBattery();

setInterval(updateDateTime, 1000);