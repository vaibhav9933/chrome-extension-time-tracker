document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/analytics")
      .then(res => res.json())
      .then(data => {
        let table = document.getElementById("reportTable");
        data.forEach(entry => {
          let row = table.insertRow();
          row.insertCell(0).textContent = entry.url;
          row.insertCell(1).textContent = Math.floor(entry.timeSpent / 1000) + "s";
        });
      });
  });
  