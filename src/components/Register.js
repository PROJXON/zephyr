"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";

const backgroundImageUrl = "/ifr.jpg"

const Register = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", 
    termsAccepted: false,
  })

  const [error, setError] = useState("");
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setIsAuthenticated, setUser } = useAuth();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
  
    if (!isValidEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
  
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Failed to create an account");
        return;
      }

      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password, 
        }),
        credentials: "include", 
      });

      const loginData = await loginResponse.json();
      setIsAuthenticated(true);
      setUser(loginData.user)
  
      if (!loginResponse.ok) {
        setError(loginData.error || "Failed to log in");
        return;
      }

      const userResponse = await fetch("/api/auth/user", { credentials: "include" });
      const userData = await userResponse.json();
      if (userData.isAuthenticated) {
        setUser(userData.user); // Make sure to set the latest user data
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };  

  return(
    // <section className="bg-gray-50 dark:bg-gray-900">
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${backgroundImageUrl})`}}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-20">
        <div className="relative w-[800px] max-w-full min-h-[500px] bg-white shadow-lg rounded-xl flex overflow-hidden">

          {/* Left: Already Have an Account? */}
          <div className="w-1/2 flex flex-col justify-center items-center p-8 bg-[#605137] text-white rounded-l-xl">
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="text-center mt-2">Already have an account? Sign in now.</p>
            
            <Link href="/login">
              <button className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#605137] transition">
                Sign In
              </button>
            </Link>
         </div>



            {/* Right: Register Form */}
              <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white bg-opacity-90 rounded-r-xl">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-2">
                      Create an account
                  </h1>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <form className="w-full" onSubmit={handleSubmit} noValidate>
                      <div>
                          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilot Callsign or Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all" 
                            placeholder="Maverick" 
                            required 
                          />
                      </div>
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            id="email"
                            autoComplete="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all" 
                            placeholder="name@company.com" 
                            required 
                          />
                      </div>
                      <div className="relative w-full">
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all" 
                            required 
                          />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-4 flex items-center text-sm text-[#605137] font-semibold hover:underline focus:outline-none">
                              {showPassword ? "Hide" : "Show"}
                            </button>
                      </div>
                      <div className="relative w-full mt-4">
                          <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                          <input 
                            type="password" 
                            name="confirmPassword" 
                            id="confirm-password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all" 
                            required
                          />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-4 flex items-center text-sm text-[#605137] font-semibold hover:underline focus:outline-none">
                              {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                      </div>
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input 
                              id="terms"
                              aria-describedby="terms" 
                              type="checkbox"
                              name="termsAccepted"
                              checked={formData.termsAccepted}
                              onChange={handleChange}
                              className="w-5 h-5 border border-gray-700 rounded bg-gray-50 focus:ring-2 focus:ring-[#605137] transition checked:bg-[#605137] checked:border-[#30291C] checked:appearance-auto"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                          </div>
                      </div>
                      <button type="submit" className="w-full mt-4 py-2 bg-[#30291C] text-white font-bold rounded-full hover:bg-[#605137] transition-all">Create an account</button>
                  </form>
              </div>
        </div>
      </div>
    </section>
  )
}

export default Register;