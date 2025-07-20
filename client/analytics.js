document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const API_BASE = 'http://localhost:3000'; //  Use backend port

  if (!token || role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
    return;
  }

  try {
    // ------------------ User Stats ------------------
    const userStatsRes = await fetch(`${API_BASE}/api/analytics/user-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { total, active, inactive } = await userStatsRes.json();

    document.getElementById("total-users").textContent = total;
    document.getElementById("active-users").textContent = active;
    document.getElementById("inactive-users").textContent = inactive;

    // ------------------ Registration Trends ------------------
    const regRes = await fetch(`${API_BASE}/api/analytics/user-registrations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const regData = await regRes.json();

    const regLabels = regData.map(r => r._id);
    const regCounts = regData.map(r => r.count);

    new Chart(document.getElementById("userChart"), {
      type: "line",
      data: {
        labels: regLabels,
        datasets: [{
          label: "New Registrations",
          data: regCounts,
          fill: false,
          borderColor: "blue",
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "User Registrations Over Time" }
        }
      }
    });

    // ------------------ Clothing Category Breakdown ------------------
    const clothingRes = await fetch(`${API_BASE}/api/analytics/clothing-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { categories } = await clothingRes.json();

    const catLabels = categories.map(c => c._id || "Uncategorized");
    const catCounts = categories.map(c => c.count);

    new Chart(document.getElementById("clothingChart"), {
      type: "pie",
      data: {
        labels: catLabels,
        datasets: [{
          data: catCounts,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#8AFFC1", "#FF8C94", "#A18CD1"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Clothing Items by Category" }
        }
      }
    });

  } catch (error) {
    console.error("Error loading analytics data:", error);
    alert("Something went wrong while loading analytics.");
  }
});