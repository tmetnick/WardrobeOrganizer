// Inject header into the top of the body
document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'flex-end';
  header.style.gap = '10px';
  header.style.margin = '20px';
  header.innerHTML = `
    <button id="homeBtn" style="padding: 8px 14px;"> Home</button>
    <button id="signOutBtn" style="padding: 8px 14px; background-color: #f44336; color: white;"> Sign Out</button>
  `;
  document.body.prepend(header);

  // Button functionality
  document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
  });

  document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'home.html';
  });
});