document.addEventListener('DOMContentLoaded', () => {
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = e.target.email.value.trim();
      const password = e.target.password.value;

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(' Backend response:', data);

        if (response.ok) {
          alert('Login successful');
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          // Redirect to the new home page
          window.location.href = 'home.html';
        } else {
          alert(`Login failed: ${data.message || 'Invalid credentials'}`);
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred while trying to login.');
      }
    });
  }

  //  Handle signup form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      try {
        const response = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(' Signup response:', data);

        if (response.ok) {
          alert('Signup successful! Please log in.');
          window.location.reload(); // reload page to show login
        } else {
          alert(`Signup failed: ${data.message}`);
        }
      } catch (err) {
        console.error('Error signing up:', err);
        alert('An error occurred during signup.');
      }
    });
  }
});
