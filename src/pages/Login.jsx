import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful");

    navigate("/dashboard");
  } catch (error) {
    console.error("Firebase Error:", error);
console.log("Code:", error.code);
console.log("Message:", error.message);

    alert(error.message);
  }
};

  return (

   
  <div className="container">
    <h2>Login</h2>

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

    <button onClick={handleLogin}>Login</button>
     <p>
        Don't have an account? <Link to="/register">Register</Link>
    </p>
  </div>
);
}

export default Login;