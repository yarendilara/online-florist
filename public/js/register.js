// Register functionality

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const alertContainer = document.getElementById('alertContainer');
  
  if (!username || !email || !password || !confirmPassword) {
    showAlert(alertContainer, 'Please fill all fields', 'warning');
    return;
  }
  
  if (password !== confirmPassword) {
    showAlert(alertContainer, 'Passwords do not match', 'warning');
    return;
  }
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    showAlert(alertContainer, 'Registration successful! Redirecting...', 'success');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  } catch (error) {
    console.error('Registration error:', error);
    showAlert(alertContainer, error.message, 'error');
  }
}
