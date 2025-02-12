"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa"; // Edit icon

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("enumerator");

  return (
    <div className="p-6">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-600">johndoe@example.com</p>
          <p className="text-gray-600">+123 456 7890</p>
        </div>

        {/* Edit Icon */}
        <button className="text-blue-500 hover:text-blue-700">
          <FaEdit size={20} />
        </button>
      </div>

      {/* Add Enumerator Button */}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
          onClick={() => setIsFormOpen(true)}
        >
          + Add User
        </button>
      </div>

      {/* Sign-up Form (Modal) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add User</h2>

            {/* Email Input */}
            <label className="block mb-2 font-medium">Email:</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Role Selection */}
            <label className="block mb-2 font-medium">Role:</label>
            <select
              className="w-full p-2 border rounded-md mb-4"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="enumerator">Field Coordinator</option>
              <option value="enumerator">Enumerator</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Total Data Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Data</h3>
          <p className="text-2xl font-bold">1,000</p>
        </div>

        {/* Total States Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total States</h3>
          <p className="text-2xl font-bold">5</p>
        </div>

        {/* Total Enumerators Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Field Coordinators</h3>
          <p className="text-2xl font-bold">10</p>
        </div>
        {/* Total Enumerators Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Enumerators</h3>
          <p className="text-2xl font-bold">50</p>
        </div>
      </div>
    </div>
  );
}

