"use client";
import { FaPlayCircle } from "react-icons/fa";
import Image from "next/image";

export default function EnumeratorDashboard() {
  return (
    <div className="p-6">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">Jane Doe</h2>
          <p className="text-gray-600">janedoe@example.com</p>
          <p className="text-gray-600">+234 123 4567</p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Surveys Completed</h3>
          <p className="text-2xl font-bold">15</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Pending Surveys</h3>
          <p className="text-2xl font-bold">3</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Responses</h3>
          <p className="text-2xl font-bold">540</p>
        </div>
      </div>

      {/* Start Survey Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold">Start a New Survey</h2>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2">
          <FaPlayCircle />
          <span>Start Survey</span>
        </button>
      </div>

      {/* View Data Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold">View Collected Data</h2>
        <p className="text-gray-600">See all the data you've gathered from your surveys.</p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">View Data</button>
      </div>
    </div>
  );
}
