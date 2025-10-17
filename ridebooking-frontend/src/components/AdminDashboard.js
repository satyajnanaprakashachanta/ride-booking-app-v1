import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [rides, setRides] = useState([]);
    const [users, setUsers] = useState([]);
    const [suspiciousActivities, setSuspiciousActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isAdmin = userInfo.mobileNumber === "admin";

    // Redirect non-admin users
    useEffect(() => {
        if (!isAdmin) {
            alert('Access denied. Admin privileges required.');
            window.location.href = '/';
        }
    }, [isAdmin]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/admin/dashboard/stats', {
                headers: { 'Admin-Token': 'admin' }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            setMessage('Failed to fetch statistics');
        }
        setLoading(false);
    };

    const fetchRides = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/admin/dashboard/rides', {
                headers: { 'Admin-Token': 'admin' }
            });
            const data = await response.json();
            setRides(data);
        } catch (error) {
            setMessage('Failed to fetch rides');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/admin/dashboard/users', {
                headers: { 'Admin-Token': 'admin' }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setMessage('Failed to fetch users');
        }
        setLoading(false);
    };

    const fetchSuspiciousActivities = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/admin/dashboard/suspicious-activities', {
                headers: { 'Admin-Token': 'admin' }
            });
            const data = await response.json();
            setSuspiciousActivities(data);
        } catch (error) {
            setMessage('Failed to fetch suspicious activities');
        }
        setLoading(false);
    };

    const blockUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to BLOCK user: ${userName}?`)) return;
        
        try {
            const response = await fetch(`http://localhost:8081/admin/users/${userId}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            setMessage(`Success: ${result.message}`);
            fetchUsers();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const unblockUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to UNBLOCK user: ${userName}?`)) return;
        
        try {
            const response = await fetch(`/admin/dashboard/users/${userId}/status?status=ACTIVE`, {
                method: 'PUT',
                headers: { 'Admin-Token': 'admin' }
            });
            const result = await response.json();
            setMessage(`Success: ${result.message}`);
            fetchUsers(); // Refresh
        } catch (error) {
            setMessage('❌ Failed to unblock user');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`WARNING: PERMANENTLY DELETE user: ${userName}?\n\nThis will delete:\n- User account\n- All their rides\n- All their bookings\n\nThis action CANNOT be undone!`)) return;
        
        try {
            const response = await fetch(`/admin/dashboard/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Admin-Token': 'admin' }
            });
            const result = await response.json();
            setMessage(`Success: ${result.message}`);
            fetchUsers(); // Refresh
        } catch (error) {
            setMessage('Error: Failed to delete user');
        }
    };

    const cancelBooking = async (bookingId) => {
        if (!window.confirm(`Cancel suspicious booking #${bookingId}?`)) return;
        
        try {
            const response = await fetch(`/admin/dashboard/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: { 'Admin-Token': 'admin' }
            });
            const result = await response.json();
            setMessage(`Success: ${result.message}`);
            // Refresh current tab data
            if (activeTab === 'suspicious') fetchSuspiciousActivities();
            else if (activeTab === 'rides') fetchRides();
        } catch (error) {
            setMessage('Error: Failed to cancel booking');
        }
    };

    useEffect(() => {
        if (activeTab === 'stats') fetchStats();
        else if (activeTab === 'rides') fetchRides();
        else if (activeTab === 'users') fetchUsers();
        else if (activeTab === 'suspicious') fetchSuspiciousActivities();
    }, [activeTab]);

    if (!isAdmin) return <div>Access Denied</div>;

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ color: "#333", marginBottom: "10px" }}>Admin Dashboard</h2>
                <p style={{ color: "#666", marginBottom: "20px" }}>Manage users, monitor ride activities, and view system statistics</p>
                    
                {message && (
                    <div style={{ 
                        padding: "15px", 
                        marginBottom: "20px",
                        backgroundColor: message.includes('Success') ? "#d4edda" : "#f8d7da",
                        color: message.includes('Success') ? "#155724" : "#721c24",
                        border: `1px solid ${message.includes('Success') ? "#c3e6cb" : "#f5c6cb"}`,
                        borderRadius: "5px",
                        position: "relative"
                    }}>
                        {message}
                        <button 
                            style={{ 
                                position: "absolute", 
                                right: "10px", 
                                top: "10px", 
                                background: "none", 
                                border: "none", 
                                fontSize: "20px", 
                                cursor: "pointer" 
                            }}
                            onClick={() => setMessage('')}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div style={{ marginBottom: "20px", borderBottom: "1px solid #dee2e6" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                            style={{
                                padding: "10px 20px",
                                backgroundColor: activeTab === 'stats' ? "#007bff" : "transparent",
                                color: activeTab === 'stats' ? "white" : "#007bff",
                                border: "1px solid #007bff",
                                borderRadius: "5px 5px 0 0",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                            onClick={() => setActiveTab('stats')}
                        >
                            Statistics
                        </button>
                        <button 
                            style={{
                                padding: "10px 20px",
                                backgroundColor: activeTab === 'rides' ? "#28a745" : "transparent",
                                color: activeTab === 'rides' ? "white" : "#28a745",
                                border: "1px solid #28a745",
                                borderRadius: "5px 5px 0 0",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                            onClick={() => setActiveTab('rides')}
                        >
                            Ride Activities
                        </button>
                        <button 
                            style={{
                                padding: "10px 20px",
                                backgroundColor: activeTab === 'users' ? "#6f42c1" : "transparent",
                                color: activeTab === 'users' ? "white" : "#6f42c1",
                                border: "1px solid #6f42c1",
                                borderRadius: "5px 5px 0 0",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                            onClick={() => setActiveTab('users')}
                        >
                            User Management
                        </button>
                        <button 
                            style={{
                                padding: "10px 20px",
                                backgroundColor: activeTab === 'suspicious' ? "#dc3545" : "transparent",
                                color: activeTab === 'suspicious' ? "white" : "#dc3545",
                                border: "1px solid #dc3545",
                                borderRadius: "5px 5px 0 0",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                            onClick={() => setActiveTab('suspicious')}
                        >
                            Suspicious Activities
                        </button>
                    </div>
                </div>

                    {loading && <div className="text-center"><div className="spinner-border"></div></div>}

                    {/* Statistics Tab */}
                    {activeTab === 'stats' && (!stats || !stats.users || !stats.rides || !stats.bookings) && !loading && (
                        <div className="alert alert-info">
                            <h4>Loading Statistics...</h4>
                            <p>Please wait while we fetch the system statistics.</p>
                        </div>
                    )}

                    {activeTab === 'stats' && stats && stats.users && stats.rides && stats.bookings && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                            <div style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "30px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                <h5 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>Users</h5>
                                <h3 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>{stats.users.total || 0}</h3>
                                <small style={{ fontSize: "14px" }}>Active: {stats.users.active || 0} | Blocked: {stats.users.blocked || 0}</small>
                            </div>
                            <div style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                padding: "30px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                <h5 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>Rides</h5>
                                <h3 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>{stats.rides.total || 0}</h3>
                                <small style={{ fontSize: "14px" }}>Pending: {stats.rides.pending || 0} | Completed: {stats.rides.completed || 0}</small>
                            </div>
                            <div style={{
                                backgroundColor: "#17a2b8",
                                color: "white",
                                padding: "30px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                <h5 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>Bookings</h5>
                                <h3 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>{stats.bookings.total || 0}</h3>
                                <small style={{ fontSize: "14px" }}>Accepted: {stats.bookings.accepted || 0} | Pending: {stats.bookings.pending || 0}</small>
                            </div>
                        </div>
                    )}

                    {/* Suspicious Activities Tab */}
                    {activeTab === 'suspicious' && (
                        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "5px" }}>
                                <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>Monitoring Self-Bookings & Suspicious Activities</h4>
                                <p style={{ margin: 0, color: "#856404" }}>
                                    This section identifies users who may be gaming the system by booking their own rides or other suspicious patterns.
                                </p>
                            </div>

                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Issue Type</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>User</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Details</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Ride/Booking ID</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Time</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suspiciousActivities.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                                <h4>No suspicious activities detected</h4>
                                                <p>All ride bookings appear to be legitimate.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        suspiciousActivities.map((activity, index) => (
                                            <tr key={index} style={{ 
                                                borderBottom: "1px solid #dee2e6",
                                                backgroundColor: activity.severity === 'HIGH' ? "#ffe6e6" : 
                                                               activity.severity === 'MEDIUM' ? "#fff3cd" : "#e8f4fd"
                                            }}>
                                                <td style={{ padding: "12px" }}>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        backgroundColor: activity.type === 'SELF_BOOKING' ? "#dc3545" :
                                                                       activity.type === 'RAPID_BOOKING' ? "#ffc107" : "#17a2b8",
                                                        color: "white"
                                                    }}>
                                                        {activity.type === 'SELF_BOOKING' ? '🚫 Self-Booking' :
                                                         activity.type === 'RAPID_BOOKING' ? '⚡ Rapid Booking' :
                                                         activity.type === 'MULTIPLE_ACCOUNTS' ? 'Multi-Account' : 
                                                         activity.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <strong>{activity.userName}</strong><br />
                                                    <small>ID: {activity.userId} | {activity.userPhone}</small>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <small>{activity.description}</small>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <small>
                                                        Ride: #{activity.rideId}<br />
                                                        {activity.bookingId && `Booking: #${activity.bookingId}`}
                                                    </small>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <small>{new Date(activity.timestamp).toLocaleString()}</small>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                        <button 
                                                            style={{
                                                                padding: "4px 8px",
                                                                backgroundColor: "#ffc107",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "3px",
                                                                cursor: "pointer",
                                                                fontSize: "12px"
                                                            }}
                                                            onClick={() => blockUser(activity.userId, activity.userName)}
                                                        >
                                                            🚫 Block User
                                                        </button>
                                                        {activity.bookingId && (
                                                            <button 
                                                                style={{
                                                                    padding: "4px 8px",
                                                                    backgroundColor: "#dc3545",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "3px",
                                                                    cursor: "pointer",
                                                                    fontSize: "12px"
                                                                }}
                                                                onClick={() => cancelBooking(activity.bookingId)}
                                                            >
                                                                ❌ Cancel Booking
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Enhanced Rides Tab with Self-Booking Detection */}
                    {activeTab === 'rides' && (
                        <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Ride ID</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Driver</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Route</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Price</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Distance</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Status</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Bookings</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Alerts</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rides.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                                <h4>📭 No rides found</h4>
                                                <p>Rides will appear here when users create them.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        rides.map(ride => {
                                            // Check for self-bookings
                                            const selfBookings = ride.bookings?.filter(booking => 
                                                booking.passengerId === ride.driverId
                                            ) || [];
                                            
                                            return (
                                                <tr key={ride.rideId} style={{ 
                                                    borderBottom: "1px solid #dee2e6",
                                                    backgroundColor: selfBookings.length > 0 ? "#ffe6e6" : "transparent"
                                                }}>
                                                    <td style={{ padding: "12px" }}>#{ride.rideId}</td>
                                                    <td style={{ padding: "12px" }}>
                                                        {ride.driverName}
                                                        {ride.driverId && <small style={{ display: "block", color: "#666" }}>ID: {ride.driverId}</small>}
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        <strong>{ride.pickupLocation}</strong>
                                                        <br />
                                                        <small style={{ color: "#666" }}>→ {ride.dropLocation}</small>
                                                    </td>
                                                    <td style={{ padding: "12px" }}>${ride.price}</td>
                                                    <td style={{ padding: "12px" }}>{ride.distanceInMiles} mi</td>
                                                    <td style={{ padding: "12px" }}>
                                                        <span style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                            backgroundColor: ride.status === 'COMPLETED' ? "#28a745" :
                                                                           ride.status === 'CONFIRMED' ? "#17a2b8" :
                                                                           ride.status === 'PENDING' ? "#ffc107" :
                                                                           ride.status === 'CANCELLED' ? "#dc3545" : "#007bff",
                                                            color: "white"
                                                        }}>
                                                            {ride.status}
                                                        </span>
                                                        {/* Show booking status summary */}
                                                        {ride.bookings && ride.bookings.length > 0 && (
                                                            <div style={{ marginTop: "4px", fontSize: "11px" }}>
                                                                {ride.bookings.some(b => b.status === 'ACCEPTED') && (
                                                                    <span style={{ color: "#28a745", fontWeight: "bold" }}>
                                                                        Has Accepted Bookings
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        <span style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                            backgroundColor: "#17a2b8",
                                                            color: "white"
                                                        }}>{ride.totalBookings}</span>
                                                        {ride.bookings && ride.bookings.length > 0 && (
                                                            <div style={{ marginTop: "5px" }}>
                                                                {ride.bookings.map(booking => (
                                                                    <small key={booking.bookingId} style={{
                                                                        display: "block",
                                                                        color: booking.passengerId === ride.driverId ? "#dc3545" : "inherit",
                                                                        fontWeight: booking.passengerId === ride.driverId ? "bold" : "normal"
                                                                    }}>
                                                                        {booking.passengerName} ({booking.status})
                                                                        {booking.passengerId === ride.driverId && " 🚫"}
                                                                    </small>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        {selfBookings.length > 0 && (
                                                            <div style={{
                                                                padding: "4px 8px",
                                                                backgroundColor: "#dc3545",
                                                                color: "white",
                                                                borderRadius: "4px",
                                                                fontSize: "12px",
                                                                fontWeight: "bold"
                                                            }}>
                                                                🚫 SELF-BOOKING
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: "12px" }}>
                                                        <small>{new Date(ride.rideTime).toLocaleString()}</small>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>User ID</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Name</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Phone</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Email</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Role</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Status</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Activity</th>
                                        <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6", fontWeight: "bold" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                                <h4>No users found</h4>
                                                <p>Regular users will appear here when they register.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                        <tr key={user.userId}>
                                            <td>#{user.userId}</td>
                                            <td>{user.name}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td>{user.email || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${
                                                    user.role === 'DRIVER' ? 'bg-primary' :
                                                    user.role === 'RIDER' ? 'bg-secondary' : 'bg-success'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    user.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <small>
                                                    Rides: {user.totalRidesAsDriver}<br />
                                                    Bookings: {user.totalBookingsAsPassenger}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="btn-group-vertical btn-group-sm">
                                                    {user.status === 'ACTIVE' ? (
                                                        <button 
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => blockUser(user.userId, user.name)}
                                                        >
                                                            🚫 Block
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => unblockUser(user.userId, user.name)}
                                                        >
                                                            Unblock
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => deleteUser(user.userId, user.name)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default AdminDashboard;
