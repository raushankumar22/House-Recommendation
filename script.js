// Define constants
const ROWS = 5;
const COLUMNS = 5;
const PLOT_TYPES = ["House", "Restaurant", "Gym", "Hospital"];
const SERVICE_WEIGHTS = {
  Restaurant: 1,
  Gym: 2,
  Hospital: 3,
};

//Define variables
let numHouses = 0;

// Generate housing layout
function generateHousingLayout() {
    const housingLayout = document.getElementById("housing-layout");
    for (let i = 0; i < ROWS * COLUMNS; i++) {
      const plot = document.createElement("div");
      plot.className = "plot";
      plot.setAttribute("data-type", "none");
      plot.setAttribute("id", `plot-${i}`);
      housingLayout.appendChild(plot);
    }
}
  
// Assign plot types
function assignPlotTypes() {
    const plots = document.querySelectorAll(".plot");
    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      let type = "none";
      while (type === "none") {
        type = PLOT_TYPES[Math.floor(Math.random() * PLOT_TYPES.length)];
        if (type === "House" && numHouses >= ROWS * COLUMNS / 2) {
          type = "none"; // Allow only half of the plots to have houses
        } else if (type !== "House" && Math.random() < 0.5) {
          type = "none"; // Allow only 50% of the plots to have services
        }
      }
      plot.setAttribute("data-type", type);
      if (type === "House") {
        numHouses++;
        const label = prompt("Enter label for the house");
        plot.setAttribute("data-label", label);
        plot.innerHTML = `<span class="house-label">${label}</span>`;
      } else {
        const services = [];
        if (Math.random() < 0.7) services.push("Restaurant");
        if (Math.random() < 0.5) services.push("Gym");
        if (Math.random() < 0.3) services.push("Hospital");
        plot.innerHTML = services.join(", ");
      }
    }
}
  
// Calculate score for each house
function calculateScore() {
    const plots = document.querySelectorAll(".plot");
    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      if (plot.getAttribute("data-type") === "House") {
        let score = 0;
        const label = plot.getAttribute("data-label");
        const x = i % COLUMNS;
        const y = Math.floor(i / COLUMNS);
        for (let j = 0; j < plots.length; j++) {
          if (plots[j].getAttribute("data-type") !== "House") {
            const dx = Math.abs(j % COLUMNS - x);
            const dy = Math.abs(Math.floor(j / COLUMNS) - y);
            if (dx + dy === 1) {
              const services = plots[j].getAttribute("data-type").split(", ");
              for (let k = 0; k < services.length; k++) {
                const service = services[k];
                score += SERVICE_WEIGHTS[service] || 0;
              }
            }
          }
        }
        plot.setAttribute("data-score", score);
      }
    }
}
  
// Get recommended house
function getRecommendedHouse() {
    const houses = Array.from(document.querySelectorAll('.plot[data-type="House"]'));
    houses.sort((a, b) => parseInt(b.getAttribute("data-score")) - parseInt(a.getAttribute("data-score")));
    const recommendedHouse = document.getElementById("recommended-house");
    if (houses.length > 0) {
      const label = houses[0].getAttribute("data-label");
      recommendedHouse.innerHTML = `<h2>Recommended House:</h2><p>${label}</p>`;
    } else {
      recommendedHouse.innerHTML = "<p>No houses found</p>";
    }
}
  

// Call functions
generateHousingLayout();
assignPlotTypes();
calculateScore();
getRecommendedHouse();