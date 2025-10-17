import React, { useState } from 'react';
import axios from 'axios';

/**
 * Enhanced Driver Registration Component
 */
const DriverRegistrationForm = ({ onDriverStart, onAdminLogin }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleInfo: ''
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

    if (!formData.driverName.trim()) {
      errors.driverName = 'Driver name is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }

    // License number is optional for this demo, but we can add validation
    // if (!formData.licenseNumber.trim()) {
    //   errors.licenseNumber = 'License number is required';
    // }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check for admin credentials first
    if (formData.driverName === 'admin' && formData.phoneNumber === 'admin123') {
      const adminData = {
        userId: 999,
        name: 'Administrator',
        email: 'admin@ridebooking.com',
        role: 'ADMIN',
        mobileNumber: 'admin123'
      };
      onAdminLogin(adminData);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create or find driver user in the main User table
      const response = await axios.post('http://localhost:8081/users', {
        name: formData.driverName.trim(),
        email: `${formData.driverName.toLowerCase().replace(/\s+/g, '')}@driver.com`,
        phoneNumber: formData.phoneNumber.trim(),
        role: 'DRIVER',
        status: 'ACTIVE',
        // Additional driver-specific info
        licenseNumber: formData.licenseNumber.trim() || 'DL123456789',
        vehicleInfo: formData.vehicleInfo.trim() || 'Vehicle info not provided'
      });

      // Show success message
      alert(`🎉 Driver Registration Successful!\n\nWelcome ${response.data.name}!\nYou can now accept ride requests.`);

      // Pass driver info to parent component
      onDriverStart({
        driverId: response.data.userId,
        driverName: response.data.name,
        driverPhone: response.data.phoneNumber,
        driverEmail: response.data.email
      });

    } catch (error) {
      console.error('Driver registration error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Invalid registration data. Please check your inputs.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError('Driver registration failed. Please try again.');
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
        <h2 style={{ color: '#333', marginBottom: '10px' }}>🚙 Driver Registration</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Join our driver network and start earning
        </p>
        <div style={{
          backgroundColor: '#e8f5e8',
          color: '#388e3c',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'inline-block',
          marginTop: '10px'
        }}>
          🚗 Quick Driver Setup
        </div>
      </div>

      {/* Admin Login Info */}
      <div style={{
        backgroundColor: '#e3f2fd',
        border: '1px solid #2196f3',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '20px',
        fontSize: '12px',
        color: '#1976d2'
      }}>
        💡 <strong>Admin Access:</strong> Use username "admin" and phone "admin123" for admin login
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
          ⚠️ {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Driver Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Driver Name *
          </label>
          <input
            type="text"
            value={formData.driverName}
            onChange={(e) => handleInputChange('driverName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.driverName ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your full name"
          />
          {validationErrors.driverName && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.driverName}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            style={{
              width: '100%',
              padding: '12px',
              border: validationErrors.phoneNumber ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter 10-digit phone number"
          />
          {validationErrors.phoneNumber && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {validationErrors.phoneNumber}
            </span>
          )}
        </div>

        {/* License Number (Optional) */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            License Number (Optional)
          </label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your driving license number"
          />
        </div>

        {/* Vehicle Info (Optional) */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
            Vehicle Information (Optional)
          </label>
          <input
            type="text"
            value={formData.vehicleInfo}
            onChange={(e) => handleInputChange('vehicleInfo', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Honda City, Blue, KA-01-AB-1234"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? '⏳ Registering Driver...' : '🚗 Start Driving'}
        </button>

        {/* Additional Info */}
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          padding: '15px',
          marginTop: '10px',
          fontSize: '14px',
          color: '#495057'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>📋 What happens next?</h4>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Your driver profile will be created</li>
            <li>You'll be able to view and accept ride requests</li>
            <li>Start earning by providing rides to passengers</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default DriverRegistrationForm;
