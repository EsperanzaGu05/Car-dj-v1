import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import "./AccountSideBar.css";

const AccountSidebar = ({ onClose }) => {
  const { auth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!auth || !auth.token) {
        console.log('No auth token found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching user details with token:', auth.token);
        const response = await fetch('http://localhost:5000/api/account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received user data:', data);
        setName(data.name || auth.name);
        setOriginalName(data.name || auth.name);
        setEmail(data.email || auth.email);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage(`Failed to fetch user details: ${error.message}`);
        setName(auth.name || '');
        setOriginalName(auth.name || '');
        setEmail(auth.email || '');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [auth]);

  const validatePassword = (password) => {
    if (password.includes(' ')) {
      return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return regex.test(password);
  };

  const validateName = (name) => {
    if (name.trim() === '') {
      setNameError('Name cannot be empty or consist only of spaces');
      return false;
    }
    if (/^\d/.test(name)) {
      setNameError('Name cannot start with a number');
      return false;
    }
    setNameError('');
    return true;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.includes(' ')) {
      setPasswordError("Password cannot contain spaces.");
    } else if (newPassword && !validatePassword(newPassword)) {
      setPasswordError('Password must contain at least one capital letter, one number, one lowercase letter, one special character, and be at least 8 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    validateName(newName);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateName(name)) {
      return;
    }

    if (password && !validatePassword(password)) {
      setMessage('Please correct the password errors before updating.');
      return;
    }

    const isNameChanged = name.trim() !== originalName.trim();
    const isPasswordChanged = password !== '';

    if (!isNameChanged && !isPasswordChanged) {
      setMessage('No changes to update.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name: name.trim(), password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isNameChanged && isPasswordChanged) {
          setMessage('Name and password updated successfully');
        } else if (isNameChanged) {
          setMessage('Name updated successfully');
        } else if (isPasswordChanged) {
          setMessage('Password updated successfully');
        } else {
          setMessage('No changes were made to your account.');
        }
        setOriginalName(name.trim());
        setPassword('');
        setPasswordError('');
      } else {
        if (response.status === 400 && data.message === "New password must be different from the current password") {
          setMessage('New password must be different from your current password.');
        } else {
          setMessage(data.message || 'An error occurred while updating your account.');
        }
      }
    } catch (error) {
      setMessage('Failed to update user details. Please try again.');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const togglePasswordSection = () => setShowPasswordSection(!showPasswordSection);

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

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
            onChange={handleNameChange}
            required
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled
          />
        </div>
        <button 
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordSection}
        >
          {showPasswordSection ? 'Hide Password Section' : 'Click to Change Password'}
        </button>
        {showPasswordSection && (
          <div className="form-group">
            <label>New Password</label>
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
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