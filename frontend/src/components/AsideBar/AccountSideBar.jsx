import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './AccountSidebar.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const AccountSidebar = ({ onClose }) => {
  const { auth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [message, setMessage] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false); // State to toggle password section visibility

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setName(data.name);
          setEmail(data.email);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('Failed to fetch user details');
      }
    };
    fetchUserDetails();
  }, [auth.token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('User updated successfully');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to update user details');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
  };

  return (
    <div className="account-sidebar">
      <button className="close-btn" onClick={onClose}>×</button>
     
      <h2>Account Details</h2>
      <div className="profile-circle">
        {name.charAt(0).toUpperCase()}
      </div>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled
          />
        </div>
        <div className="form-group">
          <h3 onClick={togglePasswordSection} className="toggle-password-section">
            {showPasswordSection ? 'Hide Password Section' : 'If you want to update password, click here'}
          </h3>
        </div>
        {showPasswordSection && (
          <div className="form-group">
            <label>New Password</label>
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </div>
        )}
        {message && <p className="message">{message}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AccountSidebar;
