// Login functionality

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const alertContainer = document.getElementById('alertContainer');
  
  if (!email || !password) {
    showAlert(alertContainer, 'Please fill all fields', 'warning');
    return;
  }
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    showAlert(alertContainer, 'Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
      if (data.user.is_admin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);
    showAlert(alertContainer, error.message, 'error');
  }
}
