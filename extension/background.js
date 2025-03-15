let activeTab = null;
let startTime = null;

// Track when a tab becomes active
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      trackTime();  // Save time for the previous tab
      startTime = new Date().getTime();
      activeTab = tab.url;
    }
  });
});

// Track when a tab is updated (e.g., page refresh or navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (tab.url) {
      trackTime();  // Save time for the previous tab
      startTime = new Date().getTime();
      activeTab = tab.url;
    }
  }
});

// Track when a tab is closed
chrome.tabs.onRemoved.addListener(() => {
  trackTime();
  activeTab = null;
  startTime = null;
});

// Function to save time spent on a URL
function trackTime() {
  if (activeTab && startTime) {
    let timeSpent = Math.floor((new Date().getTime() - startTime) / 1000); // Convert to seconds
    saveTimeData(activeTab, timeSpent);
  }
}

// Save time data locally and send to backend
function saveTimeData(url, timeSpent) {
  // Save to local storage
  chrome.storage.local.get(["timeData"], result => {
    let data = result.timeData || {};
    data[url] = (data[url] || 0) + timeSpent;
    chrome.storage.local.set({ timeData: data });
  });

  // Send to backend
  fetch("http://localhost:5000/save-time", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, timeSpent })
  })
  .then(response => response.json())
  .then(data => console.log("Data saved:", data))
  .catch(error => console.error("Error sending data:", error));
}
