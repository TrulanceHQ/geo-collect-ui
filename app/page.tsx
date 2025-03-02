/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/apiService";
import { ClipLoader } from "react-spinners";
import Image from "next/image";

export default function SignInPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("enumerator");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(emailAddress, password);
      const role = data.role || data?.user?.role;
      const token = data.accessToken || data?.user?.accessToken;
      const selectedState = data.selectedState || data?.user?.selectedState;

      if (role) {
        // Store user role in localStorage or a global state
        localStorage.setItem("userRole", role);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("selectedState", selectedState);

        if (rememberMe) {
          localStorage.setItem("emailAddress", emailAddress);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("emailAddress");
          localStorage.removeItem("password");
        }

        switch (role) {
          case "admin":
            router.push("/admin");
            break;
          case "enumerator":
            router.push("/enumerators-flow");
            break;
          case "fieldCoordinator":
            router.push("/field-coordinators-flow");
            break;
          default:
            router.push("/dashboard");
        }
      } else {
        console.error("No role found in response.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* <Image
          src="/logo.png"
          alt="Company Logo"
          width={80}
          height={50}
          priority
        /> */}
        <div className="flex justify-center items-center mb-5">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={60}
            height={50}
            priority
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-center mt-5">
          Sign In
        </h2>

        {/* Email */}
        <label className="block mb-2 font-medium">Email:</label>
        <input
          type="email"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Enter your email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />

        {/* Password */}
        <label className="block mb-2 font-medium">Password:</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Selection */}
        <label className="block mb-2 font-medium">Sign in as:</label>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Remember Me */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label className="text-sm">Remember Me</label>
        </div>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center mb-4">
            <ClipLoader size={35} color={"#123abc"} loading={loading} />
          </div>
        )}

        {/* Sign In Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleLogin}
        >
          Sign In
        </button>

        {/* Forgot Password */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Forgot password?{" "}
          <a href="#" className="text-blue-500">
            Reset here
          </a>
        </p>
      </div>
    </>
  );
}
