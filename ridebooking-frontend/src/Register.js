import React from "react";
import RegistrationForm from "./components/RegistrationForm";

function Register({ onRegistrationSuccess, onShowLogin, selectedRole }) {
  return (
    <RegistrationForm 
      onRegistrationSuccess={onRegistrationSuccess}
      onShowLogin={onShowLogin}
      selectedRole={selectedRole}
    />
  );
}

export default Register;
