import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "RIDER", status: "ACTIVE" });

  useEffect(() => {
    axios.get("http://localhost:8081/users").then(res => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8081/users", form);
    setUsers([...users, res.data]);
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
        <select onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="RIDER">RIDER</option>
          <option value="DRIVER">DRIVER</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.userId}>{u.name} ({u.role}) - {u.phone}</li>
        ))}
      </ul>
    </div>
  );
}
