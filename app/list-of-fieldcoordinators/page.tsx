"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import Image from "next/image";

// Define the data structure
interface FieldCoordinatorRecord {
  date: string;
  location: string;
  surveys: number;
  completed: number;
  age: number;
  gender: string;
  experience: string;
  performance: string;
  feedback: string;
  region: string;
  status: string;
  assignedTasks: number;
  completedTasks: number;
  accuracy: string;
  rating: number;
}

// Sample enumerator data
const enumeratorData: Record<number, FieldCoordinatorRecord[]> = {
  1: [
    {
      date: "2024-02-01",
      location: "Lagos",
      surveys: 10,
      completed: 8,
      age: 30,
      gender: "Male",
      experience: "5 years",
      performance: "Excellent",
      feedback: "Very dedicated",
      region: "South-West",
      status: "Active",
      assignedTasks: 20,
      completedTasks: 18,
      accuracy: "95%",
      rating: 4.8,
    },
    {
      date: "2024-02-02",
      location: "Abuja",
      surveys: 12,
      completed: 11,
      age: 27,
      gender: "Female",
      experience: "3 years",
      performance: "Good",
      feedback: "Needs improvement",
      region: "North-Central",
      status: "Active",
      assignedTasks: 18,
      completedTasks: 15,
      accuracy: "89%",
      rating: 4.2,
    },
  ],
  2: [
    {
      date: "2024-02-01",
      location: "Kano",
      surveys: 15,
      completed: 14,
      age: 35,
      gender: "Male",
      experience: "7 years",
      performance: "Very Good",
      feedback: "Highly skilled",
      region: "North-West",
      status: "Active",
      assignedTasks: 25,
      completedTasks: 22,
      accuracy: "92%",
      rating: 4.6,
    },
  ],
};

export default function ListOfEnumerators() {
  const fieldcoordinators = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+234 901 234 5678",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+234 902 345 6789",
    },
  ];

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // CSV Export Function
  const exportToCSV = () => {
    if (!selectedId || !enumeratorData[selectedId]) return;

    const csv = Papa.unparse(enumeratorData[selectedId]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `enumerator_${selectedId}.csv`);
  };

  // Prevent rendering until hydration is complete
  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* Only render the logo after hydration to prevent mismatch */}
      {isClient && (
        <div className="absolute top-0 right-0 p-4">
          <Image
            src="/digiplus.png"
            alt="Company Logo"
            width={120}
            height={50}
            priority
          />
          {/* <Image src="/digiplus.png" alt="Company Logo" className="h-12 w-auto" /> */}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Field Coordinators</h1>
      <p className="text-gray-600 mb-6">Manage your field coordinators here.</p>

      {/* Field Coordinators Table (Fixed) */}
      <div className="mb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-gray-600">ID</th>
              <th className="p-3 text-left text-gray-600">Name</th>
              <th className="p-3 text-left text-gray-600">Email</th>
              <th className="p-3 text-left text-gray-600">Phone</th>
              <th className="p-3 text-center text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fieldcoordinators.map((fieldcoordinator) => (
              <tr
                key={fieldcoordinator.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{fieldcoordinator.id}</td>
                <td className="p-3">{fieldcoordinator.name}</td>
                <td className="p-3">{fieldcoordinator.email}</td>
                <td className="p-3">{fieldcoordinator.phone}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mx-2"
                    onClick={() =>
                      setSelectedId(
                        fieldcoordinator.id === selectedId
                          ? null
                          : fieldcoordinator.id
                      )
                    }
                  >
                    {selectedId === fieldcoordinator.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Table (Scrollable) */}
      {selectedId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Data for {fieldcoordinators.find((e) => e.id === selectedId)?.name}
          </h2>
          <div className="border border-gray-300 rounded-lg overflow-x-auto max-w-full">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {Object.keys(enumeratorData[selectedId][0]).map((key) => (
                    <th
                      key={key}
                      className="p-3 whitespace-nowrap text-gray-600"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enumeratorData[selectedId].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="p-3 whitespace-nowrap">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CSV Download Button */}
          <div className="mt-4">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
