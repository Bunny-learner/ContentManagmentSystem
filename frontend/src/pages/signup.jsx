import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const response = await fetch("http://localhost:8000/signdata", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.message === "success") {
      alert("Signup was successful!");
      navigate("/home");
    } else {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <main className="signup-wrapper">
      {/* Back to Home Button */}
      <button 
        type="button" 
        className="btn back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <h3 className="form-title">Create an Account</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <label htmlFor="username">Create Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "At least 3 characters" },
            maxLength: { value: 10, message: "Max 10 characters" },
          })}
        />
        {errors.username && <p className="error-message">{errors.username.message}</p>}

        <label htmlFor="password">Create Password</label>
        <input
          id="password"
          type="password"
          placeholder="New Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        <button type="submit" className="btn submit-btn">
          Signup
        </button>
      </form>

      <div className="login-redirect">
        <p>Already registered? Login here</p>
        <button
          type="button"
          className="btn login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </main>
  );
}
