let scanner;
let isPaused = false;
let currentCameraId = null;
let cameras = [];
let scanHistory = [];

window.addEventListener('DOMContentLoaded', () => {
    // Auto-load dark mode if it was previously enabled
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }  
  const resultElement = document.getElementById('result');
  const toggleBtn = document.getElementById('toggle-btn');
  const switchBtn = document.getElementById('switch-btn');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
});

  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');

  // Load scan history from localStorage
  scanHistory = JSON.parse(localStorage.getItem('qrHistory')) || [];

  function updateHistoryUI() {
    historyList.innerHTML = '';
    scanHistory.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      historyList.appendChild(li);
    });
  }

  function onScanSuccess(decodedText, decodedResult) {
    resultElement.innerText = `Scanned Result: ${decodedText}`;

    // Save only if it's a new scan
    const now = new Date();
const timestamp = now.getFullYear() + "-" +
  String(now.getMonth() + 1).padStart(2, '0') + "-" +
  String(now.getDate()).padStart(2, '0') + " " +
  String(now.getHours()).padStart(2, '0') + ":" +
  String(now.getMinutes()).padStart(2, '0') + ":" +
  String(now.getSeconds()).padStart(2, '0');
    const fullEntry = `[${timestamp}] ${decodedText}`;
    
    if (!scanHistory.includes(fullEntry)) {
      scanHistory.push(fullEntry);
      localStorage.setItem('qrHistory', JSON.stringify(scanHistory));
      updateHistoryUI();
    }
    
  }

  // Init QR scanner
  scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  ).then(() => {
    // Get all available cameras
    Html5Qrcode.getCameras().then(devices => {
      cameras = devices;
      if (devices.length) {
        currentCameraId = devices[0].id;
      }
    });
  });

  // Pause/Resume
  toggleBtn.addEventListener('click', () => {
    if (!isPaused) {
      scanner.pause();
      toggleBtn.textContent = 'Resume';
    } else {
      scanner.resume();
      toggleBtn.textContent = 'Pause';
    }
    isPaused = !isPaused;
  });

  // Switch Camera
  let usingBackCamera = true; // Add this line at the top (near your global vars)

  switchBtn.addEventListener('click', () => {
    const nextFacingMode = usingBackCamera ? "user" : "environment";
  
    scanner.stop().then(() => {
      scanner.start(
        { facingMode: nextFacingMode },
        { fps: 10, qrbox: 250 },
        onScanSuccess
      ).then(() => {
        usingBackCamera = !usingBackCamera;
      });
    }).catch(err => {
      alert("Failed to switch camera: " + err);
    });
  });
  

  // Clear history
  clearHistoryBtn.addEventListener('click', () => {
    scanHistory = [];
    localStorage.removeItem('qrHistory');
    updateHistoryUI();
  });

  updateHistoryUI(); // show history on load
});
const downloadBtn = document.getElementById('download-history');

downloadBtn.addEventListener('click', () => {
  if (scanHistory.length === 0) {
    alert("No scan history to download.");
    return;
  }

  const blob = new Blob([scanHistory.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr-scan-history.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


