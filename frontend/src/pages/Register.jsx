import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User registered successfully!");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-80">
        <h2 className="text-white text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-gray-200 text-center mb-6">
          Start tracking your expenses
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:scale-105 transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
}
