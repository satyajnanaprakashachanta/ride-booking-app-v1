import React, { useState, useEffect } from 'react';

const DriverDashboard = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState('available');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Debug: Log userInfo to see what we're working with
  console.log('DriverDashboard - userInfo:', userInfo);
  console.log('DriverDashboard - userInfo.userId:', userInfo?.userId);
  console.log('DriverDashboard - userInfo.role:', userInfo?.role);

  useEffect(() => {
    if (userInfo && userInfo.userId) {
      fetchPendingBookings();
      fetchAcceptedBookings();
    } else {
      setMessage('Error: User information not available');
      setLoading(false);
    }
  }, [userInfo]);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/bookings/pending');
      if (response.ok) {
        const data = await response.json();
        // Filter out bookings from the same user (prevent self-booking)
        const filteredBookings = data.filter(booking => 
          booking.riderId !== userInfo.userId && 
          booking.riderPhone !== userInfo.mobileNumber &&
          booking.riderName !== userInfo.fullName
        );
        setPendingBookings(filteredBookings);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      setMessage('Error: Failed to load available rides');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8081/bookings/drivers/${userInfo.userId}/accepted`);
      if (response.ok) {
        const data = await response.json();
        console.log('Driver accepted bookings data:', data); // Debug log
        setAcceptedBookings(data);
      }
    } catch (error) {
      console.error('Error fetching accepted bookings:', error);
      setMessage('Error: Failed to load accepted rides');
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      console.log('=== ACCEPT BOOKING DEBUG ===');
      console.log('Attempting to accept booking:', bookingId);
      console.log('User Info:', userInfo);
      console.log('Driver ID being sent:', userInfo?.userId);
      console.log('User role:', userInfo?.role);
      console.log('User phone:', userInfo?.mobileNumber);
      
      if (!userInfo || !userInfo.userId) {
        setMessage('Error: User information not available. Please login again.');
        return;
      }
      
      const response = await fetch(`http://localhost:8081/bookings/${bookingId}/accept?driverId=${userInfo.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        setMessage('Success: Booking accepted successfully!');
        fetchPendingBookings();
        fetchAcceptedBookings();
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorText = await response.text();
        console.error('API Error Response (text):', errorText);
        
        let errorMessage = 'Failed to accept booking';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        console.error('Final error message:', errorMessage);
        setMessage(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      setMessage(`Error: ${error.message || 'Failed to accept booking'}`);
    }
  };

  const refreshData = () => {
    if (userInfo && userInfo.userId) {
      fetchPendingBookings();
      fetchAcceptedBookings();
      setMessage('Data refreshed');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Error: User information not available');
    }
  };

  // Early return if userInfo is not available
  if (!userInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Error: User information not available</h3>
        <p>Please login again to access the driver dashboard.</p>
      </div>
    );
  }

  if (!userInfo.userId) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Error: User ID not found</h3>
        <p>User ID: {userInfo.userId}</p>
        <p>Please login again to access the driver dashboard.</p>
      </div>
    );
  }

  if (loading && activeTab === 'available') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Loading available rides...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ color: '#333', margin: '0 0 5px 0' }}>Driver Dashboard</h2>
          <p style={{ color: '#666', margin: 0 }}>Welcome {userInfo.fullName}!</p>
        </div>
        <button
          onClick={refreshData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '5px',
          backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
          color: message.includes('Success') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'white',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setActiveTab('available')}
            style={{
              flex: 1,
              padding: '15px 20px',
              border: 'none',
              backgroundColor: activeTab === 'available' ? '#007bff' : 'white',
              color: activeTab === 'available' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Available Rides ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            style={{
              flex: 1,
              padding: '15px 20px',
              border: 'none',
              backgroundColor: activeTab === 'accepted' ? '#28a745' : 'white',
              color: activeTab === 'accepted' ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            My Accepted Rides ({acceptedBookings.length})
          </button>
        </div>
      </div>

      {/* Available Rides Tab */}
      {activeTab === 'available' && (
        <div>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>
            Available Rides for You to Accept
          </h3>
          
          {pendingBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ color: '#666' }}>No rides available at the moment</h4>
              <p style={{ color: '#999' }}>Check back later for new ride requests!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {pendingBookings.map((booking) => (
                <div key={booking.bookingId} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                    {/* Ride Details */}
                    <div>
                      <h4 style={{ color: '#333', margin: '0 0 15px 0' }}>
                        Ride Request #{booking.bookingId}
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <strong>Pickup:</strong><br />
                          <span style={{ color: '#666' }}>{booking.pickupLocation}</span>
                        </div>
                        <div>
                          <strong>Drop-off:</strong><br />
                          <span style={{ color: '#666' }}>{booking.dropLocation}</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <strong>Distance:</strong><br />
                          <span style={{ color: '#666' }}>{booking.distanceInMiles} miles</span>
                        </div>
                        <div>
                          <strong>Fare:</strong><br />
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>${booking.fare}</span>
                        </div>
                        <div>
                          <strong>Time:</strong><br />
                          <span style={{ color: '#666' }}>{booking.rideTime}</span>
                        </div>
                      </div>

                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>Passenger Details</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <strong>Name:</strong> {booking.riderName}
                          </div>
                          <div>
                            <strong>Phone:</strong> {booking.riderPhone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => acceptBooking(booking.bookingId)}
                        style={{
                          padding: '15px 25px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#218838';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#28a745';
                        }}
                      >
                        Accept Ride
                      </button>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        margin: '10px 0 0 0',
                        lineHeight: '1.4'
                      }}>
                        Earn ${booking.fareAmount} for this trip
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accepted Rides Tab */}
      {activeTab === 'accepted' && (
        <div>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>
            Your Accepted Rides
          </h3>
          
          {acceptedBookings.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ color: '#666' }}>No accepted rides yet</h4>
              <p style={{ color: '#999' }}>Accept rides from the Available Rides tab to see them here!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {acceptedBookings.map((booking) => (
                <div key={booking.bookingId} style={{
                  backgroundColor: '#f8fff8',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #28a745'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
                    {/* Ride Details */}
                    <div>
                      <h4 style={{ color: '#28a745', margin: '0 0 15px 0' }}>
                        ✅ Accepted Ride #{booking.bookingId} - Booked by {booking.riderName}
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <strong>Pickup:</strong><br />
                          <span style={{ color: '#666' }}>{booking.pickupLocation}</span>
                        </div>
                        <div>
                          <strong>Drop-off:</strong><br />
                          <span style={{ color: '#666' }}>{booking.dropLocation}</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <strong>Distance:</strong><br />
                          <span style={{ color: '#666' }}>{booking.distanceInMiles} miles</span>
                        </div>
                        <div>
                          <strong>Your Earning:</strong><br />
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>${booking.fare}</span>
                        </div>
                        <div>
                          <strong>Time:</strong><br />
                          <span style={{ color: '#666' }}>{booking.rideTime}</span>
                        </div>
                      </div>

                      <div style={{ 
                        backgroundColor: '#e8f5e8', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '2px solid #28a745'
                      }}>
                        <h5 style={{ margin: '0 0 15px 0', color: '#155724' }}>👤 PASSENGER WHO BOOKED THIS RIDE</h5>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: '15px',
                          marginBottom: '15px'
                        }}>
                          <div style={{ 
                            backgroundColor: '#d4edda',
                            padding: '10px',
                            borderRadius: '5px'
                          }}>
                            <strong style={{ color: '#155724' }}>Passenger Name:</strong><br />
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                              {booking.riderName}
                            </span>
                          </div>
                          <div style={{ 
                            backgroundColor: '#d4edda',
                            padding: '10px',
                            borderRadius: '5px'
                          }}>
                            <strong style={{ color: '#155724' }}>Contact Number:</strong><br />
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                              {booking.riderPhone}
                            </span>
                          </div>
                        </div>
                        <div style={{ 
                          backgroundColor: '#c3e6cb',
                          padding: '10px',
                          borderRadius: '5px',
                          textAlign: 'center'
                        }}>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '14px', 
                            color: '#155724',
                            fontWeight: 'bold'
                          }}>
                            📞 Call {booking.riderName} to coordinate pickup at {booking.pickupLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        padding: '15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                      }}>
                        CONFIRMED
                      </div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        margin: '10px 0 0 0',
                        lineHeight: '1.4'
                      }}>
                        Ride confirmed and ready to start
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
