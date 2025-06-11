import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const onSubmit = async (formData) => {
    await delay(3000);

    try {
      const response = await fetch(`/logindata` , {
        method: 'POST',
        credentials:'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      if (res.message === "success") {
        alert('Login was successful!!');
        navigate('/home');
      }
      else{
        alert('Login was unsuccessful please try again !!')
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className='login-wrapper'>

      {/* Back to Home Button */}
      <button 
        type="button" 
        className="btn back-home-btn"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>

      <h3 className="form-title">Login to Your Account</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <label htmlFor="username">Enter Your Username</label>
        <input 
          type="text" 
          id="username"
          placeholder="Username"
          {...register("username", { 
            required: "Username is required", 
            minLength: { value: 3, message: "Minimum 3 characters" }, 
            maxLength: { value: 10, message: "Maximum 10 characters" }
          })}
        />
        {errors.username && <p className="error-message">{errors.username.message}</p>}

        <label htmlFor="password">Enter Your Password</label>
        <input 
          type="password" 
          id="password"
          placeholder="Password"
          {...register("password", { 
            required: "Password is required", 
            minLength: { value: 6, message: "Minimum 6 characters" }
          })}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <button type='submit' className='btn submit-btn'>Login</button>
      </form>

      <div className="signup-redirect">
        <p>New user? Create account now</p>
        <button 
          className="btn signup-btn" 
          onClick={() => navigate('/signup')}
          type="button"
        >
          Signup
        </button>
      </div>
    </main>
  );
}
