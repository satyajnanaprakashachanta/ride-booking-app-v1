import React, { useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [rideId, setRideId] = useState("");
  const [riderId, setRiderId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [driverId, setDriverId] = useState("");

  const createBooking = async () => {
    const res = await axios.post(`http://localhost:8081/bookings/${rideId}/${riderId}`);
    alert("Booking created: " + JSON.stringify(res.data));
  };

  const acceptBooking = async () => {
    await axios.put(`http://localhost:8081/bookings/${bookingId}/accept?driverId=${driverId}`);
    alert("Booking accepted!");
  };

  const rejectBooking = async () => {
    await axios.put(`http://localhost:8081/bookings/${bookingId}/reject?driverId=${driverId}`);
    alert("Booking rejected!");
  };

  return (
    <div>
      <h2>Bookings</h2>
      <input placeholder="Ride ID" onChange={e => setRideId(e.target.value)} />
      <input placeholder="Rider ID" onChange={e => setRiderId(e.target.value)} />
      <button onClick={createBooking}>Request Ride</button>

      <hr />
      <input placeholder="Booking ID" onChange={e => setBookingId(e.target.value)} />
      <input placeholder="Driver ID" onChange={e => setDriverId(e.target.value)} />
      <button onClick={acceptBooking}>Accept</button>
      <button onClick={rejectBooking}>Reject</button>
    </div>
  );
}
