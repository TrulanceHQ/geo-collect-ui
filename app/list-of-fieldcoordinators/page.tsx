"use client";

import { useState, useEffect } from "react";
// import Papa from "papaparse";
// import { saveAs } from "file-saver";
// import Image from "next/image";
import { fetchAllUsers, User } from "@/services/apiService";

export default function ListOfFieldCoordinators() {
  const [fieldCoordinators, setFieldCoordinators] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchData = async () => {
      const users = await fetchAllUsers();
      const coordinators = users.filter(
        (user) => user.role === "fieldCoordinator"
      );
      setFieldCoordinators(coordinators);
    };

    fetchData();
  }, []);

  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Field Coordinators</h1>
      <p className="text-gray-600 mb-6">Manage your field coordinators here.</p>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left text-gray-600">ID</th>
            <th className="p-3 text-left text-gray-600">Name</th>
            <th className="p-3 text-left text-gray-600">Email</th>
            <th className="p-3 text-left text-gray-600">Phone</th>
            {/* <th className="p-3 text-center text-gray-600">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {fieldCoordinators.map((coordinator) => (
            <tr key={coordinator._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{coordinator._id}</td>
              <td className="p-3">
                {coordinator.firstName} {coordinator.lastName}
              </td>
              <td className="p-3">{coordinator.emailAddress}</td>
              <td className="p-3">{coordinator.phoneNumber || "N/A"}</td>
              <td className="p-3 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700 mx-2"
                  onClick={() =>
                    setSelectedId(
                      selectedId === coordinator._id ? null : coordinator._id
                    )
                  }
                >
                  {selectedId === coordinator._id ? "Hide" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
