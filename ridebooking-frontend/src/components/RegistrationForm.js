import React, { useState } from 'react';
import axios from 'axios';

/**
 * Enhanced Registration Component with better error handling and user experience
 */
const RegistrationForm = ({ onRegistrationSuccess, onShowLogin, selectedRole }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = `Mobile number must be exactly 10 digits (currently ${formData.mobileNumber.length} digits)`;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!/^\d{4}$/.test(formData.password)) {
      errors.password = 'Password must be exactly 4 digits';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration request to http://localhost:8081/auth/register...');
      console.log('Registration data:', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        role: selectedRole || 'RIDER'
      });
      
      const response = await axios({
        method: 'POST',
        url: 'http://localhost:8081/auth/register',
        data: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: selectedRole || 'RIDER'
        },
        timeout: 15000, // 15 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      console.log('Registration response:', response.data);

      if (response.data && response.data.success) {
        // Show success message
        alert(`Registration Successful!\n\nWelcome ${response.data.fullName}!\nUser ID: ${response.data.userId}\nMobile: ${response.data.mobileNumber}\n\nYou can now log in with your mobile number and password.`);
        
        // Clear the form
        setFormData({
          firstName: '',
          lastName: '',
          mobileNumber: '',
          password: '',
          confirmPassword: ''
        });
        
        // Pass the user data to parent component
        if (onRegistrationSuccess) {
          onRegistrationSuccess(response.data);
        }
      } else {
        setError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.log('Error details:', {
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code
      });
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 400) {
        setError('Invalid registration data. Please check your inputs.');
      } else if (error.response?.status === 409) {
        setError('This mobile number is already registered. Please use a different number or try logging in.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 8081.');
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Registration failed. Please try again. Check browser console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Create Account</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Fill in your details to get started
        </p>
        {selectedRole && (
          <div style={{
            backgroundColor: selectedRole === 'RIDER' ? '#e3f2fd' : '#e8f5e8',
            color: selectedRole === 'RIDER' ? '#1976d2' : '#388e3c',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '10px'
          }}>
            {selectedRole === 'RIDER' ? 'Registering as Rider' : 'Registering as Driver'}
          </div>
        )}
      </div>

      {/* General Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* First Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.firstName ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your first name"
          />
          {validationErrors.firstName && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.firstName}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.lastName ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your last name"
          />
          {validationErrors.lastName && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.lastName}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Mobile Number *
          </label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.mobileNumber ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter 10-digit mobile number"
          />
          {validationErrors.mobileNumber && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.mobileNumber}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Password (4 digits) *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value.replace(/\D/g, '').slice(0, 4))}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.password ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter 4-digit password"
            maxLength="4"
          />
          {validationErrors.password && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value.replace(/\D/g, '').slice(0, 4))}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.confirmPassword ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Confirm your 4-digit password"
            maxLength="4"
          />
          {validationErrors.confirmPassword && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.confirmPassword}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <button
            type="button"
            onClick={onShowLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
