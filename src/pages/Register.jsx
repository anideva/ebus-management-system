import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User Registered Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

return (
  <div className="container">
    <h2>Register</h2>

    <input
      type="email"
      placeholder="Enter email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Enter password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleRegister}>Register</button>
    <p>
  Already have an account? <Link to="/login">Login</Link>
</p>
  </div>
);
}

export default Register;