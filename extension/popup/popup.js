document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["timeData"], result => {
      let timeList = document.getElementById("timeList");
      let data = result.timeData || {};
      for (let site in data) {
        let li = document.createElement("li");
        li.textContent = `${site}: ${Math.floor(data[site] / 1000)}s`;
        timeList.appendChild(li);
      }
    });
  });
  