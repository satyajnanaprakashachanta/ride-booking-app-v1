import React, { useState } from "react";
import axios from "axios";

function RideForm() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [price, setPrice] = useState("");
  const [distanceInMiles, setDistanceInMiles] = useState("");
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState("");
  const [response, setResponse] = useState(null);

  // For demo, using Bob Driver (ID=1)
  const driverId = 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8081/rides/${driverId}`,
        {
          pickupLocation,
          dropLocation,
          time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          price: parseFloat(price),
          distanceInMiles: parseFloat(distanceInMiles),
          estimatedDurationMinutes: parseInt(estimatedDurationMinutes),
        }
      );
      setResponse(res.data);
    } catch (error) {
      console.error(error);
      alert("Error creating ride. Check backend logs.");
    }
  };

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
      <h2>Create a New Ride (Driver)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Drop Location"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
          required
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Distance (miles)"
          value={distanceInMiles}
          onChange={(e) => setDistanceInMiles(e.target.value)}
          step="0.1"
          min="0"
          required
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Estimated Time (minutes)"
          value={estimatedDurationMinutes}
          onChange={(e) => setEstimatedDurationMinutes(e.target.value)}
          min="1"
          required
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0"
          required
          style={{ margin: "5px", padding: "8px", width: "200px" }}
        />
        <br />
        <button type="submit" style={{ margin: "10px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "3px" }}>
          Create Ride
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #4CAF50", borderRadius: "5px", backgroundColor: "#f0f8f0" }}>
          <h3 style={{ color: "green" }}>Ride Created Successfully!</h3>
          <p><strong>Ride ID:</strong> {response.rideId}</p>
          <p><strong>Route:</strong> {response.pickupLocation} → {response.dropLocation}</p>
          <p><strong>Distance:</strong> {response.distanceInMiles} miles</p>
          <p><strong>Estimated Time:</strong> {response.estimatedDurationMinutes} minutes</p>
          <p><strong>Price:</strong> ${response.price}</p>
          <p><strong>Driver:</strong> {response.driverName}</p>
          <p><strong>Status:</strong> {response.status}</p>
        </div>
      )}
    </div>
  );
}

export default RideForm;
