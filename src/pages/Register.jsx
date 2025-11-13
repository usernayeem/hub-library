import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

export const Register = () => {
  const { registerUser, googleAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const showToast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveUserToDatabase = async (user, displayName) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    try {
      const userData = {
        uid: user.uid,
        name: displayName || user.displayName || "Anonymous",
        email: user.email,
        role: "viewer",
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to save user to database");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setEmailLoading(true);

    if (!formData.name.trim()) {
      showToast.error("Please enter your name");
      setEmailLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      showToast.error("Please enter your email");
      setEmailLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast.error("Please enter a valid email address");
      setEmailLoading(false);
      return;
    }

    if (!formData.password) {
      showToast.error("Please enter your password");
      setEmailLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      showToast.error(passwordError);
      setEmailLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData.email, formData.password);

      await updateProfile(result.user, {
        displayName: formData.name,
      });

      await saveUserToDatabase(result.user, formData.name);

      showToast.success("Registration successful! Welcome to Hamdard Library.");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        showToast.error("This email is already registered");
      } else if (error.code === "auth/invalid-email") {
        showToast.error("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        showToast.error("Password is too weak");
      } else {
        showToast.error("Registration failed. Please try again.");
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);

    try {
      const result = await googleAuth();
      await saveUserToDatabase(result.user);
      showToast.success("Successfully signed in with Google!");
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        showToast.error("Sign-in popup was closed");
      } else if (error.code === "auth/cancelled-popup-request") {
        return;
      } else {
        showToast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Create Account
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Join Hamdard University Bangladesh Library
          </p>
          <p
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            English Department
          </p>
        </div>

        <div
          className={`rounded-2xl shadow-xl p-8 border transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-base ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
                disabled={emailLoading || googleLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-base ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                }`}
                disabled={emailLoading || googleLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-base pr-12 ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
                  }`}
                  disabled={emailLoading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={emailLoading || googleLoading}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <p
                className={`text-xs mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Must be at least 6 characters with uppercase and lowercase
                letters
              </p>
            </div>

            <button
              type="submit"
              disabled={emailLoading || googleLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {emailLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-4 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={emailLoading || googleLoading}
            className={`w-full border font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {googleLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <FaGoogle className="text-red-500" size={20} />
                Sign up with Google
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className={`font-semibold hover:underline transition ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p
          className={`text-center text-xs mt-6 ${
            theme === "dark" ? "text-gray-500" : "text-gray-500"
          }`}
        >
          By creating an account, you agree to Hamdard University Bangladesh
          Library's terms of service
        </p>
      </div>
    </div>
  );
};
