import React, { useState } from "react";
import axios from "axios";

export default function Rides() {
  const [ride, setRide] = useState({ pickupLocation: "", dropLocation: "", price: "" });
  const [driverId, setDriverId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:8081/rides/${driverId}`, ride);
    alert("Ride created!");
  };

  return (
    <div>
      <h2>Create Ride</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Driver ID" onChange={e => setDriverId(e.target.value)} />
        <input placeholder="Pickup" onChange={e => setRide({ ...ride, pickupLocation: e.target.value })} />
        <input placeholder="Drop" onChange={e => setRide({ ...ride, dropLocation: e.target.value })} />
        <input placeholder="Price" onChange={e => setRide({ ...ride, price: e.target.value })} />
        <button type="submit">Post Ride</button>
      </form>
    </div>
  );
}

