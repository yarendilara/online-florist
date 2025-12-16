const User = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Create user
      const userId = await User.create(username, email, password, false);
      
      // Set session
      const user = await User.findById(userId);
      req.session.user = user;

      return res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set session
      req.session.user = user;
      return res.json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      return res.json({ message: 'Logout successful' });
    });
  }

  static async getProfile(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await User.findById(req.session.user.id);
      return res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}

module.exports = AuthController;
