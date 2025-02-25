"use client";

import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
import Image from "next/image";
import ProtectedPage from "@/components/ProtectedPage";
import {
  createEnumerators,
  fetchUserData,
  getEnumeratorCountByFieldCoordinator,
  updateUserProfile,
} from "@/services/apiService";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaEdit } from "react-icons/fa";

export default function FieldCoordinatorsDashboard() {
  const [fieldCoordData, setFieldCoordData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  const [enumeratorCount, setEnumeratorCount] = useState(0);
  // const [error, setError] = useState('');

  const [isEditMode, setIsEditMode] = useState(false); // Toggle Edit mode
  const [updatedFieldCoordData, setUpdatedFieldCoordData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchFieldCoordData = async () => {
      // Decode the JWT token to get userId
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Handle case where no token exists
        console.error("No token found");
        return;
      }

      try {
        const decodedToken = jwtDecode<{ sub: string }>(token); // Define the expected type
        const userId = decodedToken.sub;
        console.log("Decoded Token:", decodedToken);

        const data = await fetchUserData(userId); // Now userId is typed as string
        setFieldCoordData({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
        });

        setUpdatedFieldCoordData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          emailAddress: data.emailAddress || "",
          phoneNumber: data.phoneNumber || "",
        });

        // Fetch enumerator count
        const count = await getEnumeratorCountByFieldCoordinator(userId);
        setEnumeratorCount(count);
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
      }
    };

    fetchFieldCoordData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedFieldCoordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const userId = jwtDecode<{ sub: string }>(token).sub;

    try {
      await updateUserProfile(userId, updatedFieldCoordData);
      setFieldCoordData(updatedFieldCoordData); // Update the state with the new data
      setIsEditMode(false); // Switch to view mode
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating profile:", error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [role, setRole] = useState("enumerator");
  // const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  {
    error && <p className="text-red-500">{error}</p>;
  }
  {
    success && <p className="text-green-500">{success}</p>;
  }

  const router = useRouter();

  // Logout function
  const logout = () => {
    // Remove stored data from localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedState");

    // Redirect to login page
    router.push("/");
  };
  // fetchTotalStates
  const handleCreateEnum = async () => {
    const creatorRole = "fieldCoordinator";

    try {
      const data = await createEnumerators(emailAddress, role, creatorRole);
      console.log("User created successfully:", data); // Log the success
      setSuccess("User created successfully!");
      setIsFormOpen(false); // Close the form/modal after successful creation
      setError(""); // Clear previous errors
    } catch (error: unknown) {
      // Check if the error is an AxiosError
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          setError("You do not have permission to create enum.");
        } else {
          setError("Failed to create enumerator. Please try again.");
        }
      } else {
        // Handle other types of errors
        setError("An unexpected error occurred.");
      }
      setSuccess("");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const surveyData = [
    {
      id: 1,
      enumerator: "John Doe",
      date: "2024-02-10",
      location: "Lagos",
      responses: 15,
    },
    {
      id: 2,
      enumerator: "Jane Doe",
      date: "2024-02-11",
      location: "Abuja",
      responses: 10,
    },
    {
      id: 3,
      enumerator: "Mark Smith",
      date: "2024-02-12",
      location: "Kano",
      responses: 20,
    },
  ];

  return (
    <>
      <ProtectedPage allowedRoles={["fieldCoordinator"]} redirectPath="/">
        <button
          className="bg-red-400 text-white px-4 py-1 rounded"
          onClick={logout}
        >
          Log Out
        </button>
        <div className="relative p-6">
          <h1 style={{ fontSize: "1.4rem" }}>
            <b>Field Coordinator</b>
          </h1>
          {/* Logo at the top right */}
          <div className="absolute top-4 right-6">
            <Image
              src="/digiplus.png"
              alt="Company Logo"
              width={120}
              height={50}
              priority
            />
          </div>

          {/* Profile Data */}
          {isEditMode ? (
            <div>
              <input
                type="text"
                name="firstName"
                value={updatedFieldCoordData.firstName}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={updatedFieldCoordData.lastName}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="emailAddress"
                value={updatedFieldCoordData.emailAddress}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Email Address"
                disabled // This will disable editing the email field
              />
              <input
                type="text"
                name="phoneNumber"
                value={updatedFieldCoordData.phoneNumber}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Phone Number"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold">
                {`${fieldCoordData?.firstName || "First Name"} ${
                  fieldCoordData?.lastName || "Last Name"
                }`}
              </h2>
              <p className="text-gray-600">
                {fieldCoordData?.emailAddress || "No email"}
              </p>
              <p className="text-gray-600">
                {fieldCoordData?.phoneNumber || "No phone number"}
              </p>
            </div>
          )}
        </div>

        {/* <button className="text-blue-500 hover:text-blue-700">
            <FaEdit size={20} />
          </button> */}
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setIsEditMode((prev) => !prev)}
        >
          <FaEdit size={20} />
        </button>
        {/* </div> */}

        {/* Save Button (only when in Edit Mode) */}
        {isEditMode && (
          <div className="mt-4">
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-auto"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </button>
          </div>
        )}
        {/* Profile Section */}
        {/* <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold">Name</h2>
              <p className="text-gray-600">fieldcoord@gmail.com</p>
              <p className="text-gray-600">+234 123 4567</p>
            </div>
          </div> */}

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Surveys Completed</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Enumerators</h3>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-2xl font-bold">{enumeratorCount}</p>
            )}
          </div>
        </div>

        {/* Add Enumerator Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            + Add Enumerator
          </button>
        </div>

        {/* Sign-up Form (Modal) */}
        {isClient && isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add Enumerator</h2>
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <label className="block mb-2 font-medium">Role:</label>
              <select
                className="w-full p-2 border rounded-md mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="enumerator">Enumerator</option>
              </select>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleCreateEnum}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Data Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">View Collected Data</h2>
          <p className="text-gray-600">
            See all the data your enumerators have gathered from surveys.
          </p>
          <button
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
            onClick={() => setIsDataVisible(!isDataVisible)}
          >
            {isDataVisible ? "Hide Data" : "View Data"}
          </button>
        </div>

        {/* Data Table */}
        {isDataVisible && isClient && (
          <div className="mt-6 bg-white shadow-md rounded-lg p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">
              Collected Survey Data
            </h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left border">ID</th>
                  <th className="p-3 text-left border">Enumerator</th>
                  <th className="p-3 text-left border">Date</th>
                  <th className="p-3 text-left border">Location</th>
                  <th className="p-3 text-left border">Responses</th>
                </tr>
              </thead>
              <tbody>
                {surveyData.map((data) => (
                  <tr key={data.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">{data.id}</td>
                    <td className="p-3 border">{data.enumerator}</td>
                    <td className="p-3 border">{data.date}</td>
                    <td className="p-3 border">{data.location}</td>
                    <td className="p-3 border">{data.responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* </div> */}
      </ProtectedPage>
    </>
  );
}
