import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Function started");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response received", res);

      const data = await res.json();
      console.log("Data:", data);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Login successful");

      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("ERROR:", error);
      alert("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-80">
        <h2 className="text-white text-3xl font-bold text-center mb-2">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg"
        />

        <button
          onClick={() => {
            console.log("Login clicked");
            handleLogin();
          }}
          className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
