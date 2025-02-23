/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaPlayCircle } from "react-icons/fa";
import SurveyForm from "@/components/Survey";
import Image from "next/image";
import ProtectedPage from "@/components/ProtectedPage";
import { fetchEnumeratorResponses } from "@/services/apiService";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { fetchUserData, updateUserProfile } from "@/services/apiService";
import { jwtDecode } from "jwt-decode";


interface Response {
  surveyId: string;
  enumeratorId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  submittedAt: string;
}

export default function EnumeratorDashboard() {
  const [enumeratorData, setEnumeratorData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [updatedEnumeratorData, setUpdatedEnumeratorData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string;
  }>({
    latitude: null,
    longitude: null,
    address: "",
  });

  useEffect(() => {
    const fetchEnumaratorData = async () => {
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
        setEnumeratorData({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
        });

        setUpdatedEnumeratorData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          emailAddress: data.emailAddress || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
      }
    };

    fetchEnumaratorData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedEnumeratorData((prevData) => ({
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
      await updateUserProfile(userId, updatedEnumeratorData);
      setEnumeratorData(updatedEnumeratorData); // Update the state with the new data
      setIsEditMode(false); // Switch to view mode
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating profile:", error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };


  // Logout function
  const logout = () => {
    // Remove stored data from localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedState");
    // Redirect to login page
    router.push("/");
  };

  useEffect(() => {
    setIsClient(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const address = response.data.display_name;
            setLocation((prev) => ({ ...prev, address }));
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data: Response[] = await fetchEnumeratorResponses();
        setResponses(data);
        setTotalResponses(data.length);
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [setResponses]);

  if (!isClient) {
    return null;
  }

  return (
    <ProtectedPage allowedRoles={["enumerator"]} redirectPath="/">
      {/* <> */}
        <div>
          <button
            className="bg-red-400 text-white px-4 py-1 rounded"
            onClick={logout}
          >
            Log Out
          </button>
        </div>
        <div className="relative p-6">
          <h1 style={{ fontSize: "1.4rem" }}>
            <b>Enumerator</b>
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
                value={updatedEnumeratorData.firstName}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={updatedEnumeratorData.lastName}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="emailAddress"
                value={updatedEnumeratorData.emailAddress}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Email Address"
                disabled // This will disable editing the email field
              />
              <input
                type="text"
                name="phoneNumber"
                value={updatedEnumeratorData.phoneNumber}
                onChange={handleInputChange}
                className="border p-2 rounded-md mb-2"
                placeholder="Phone Number"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold">
                {`${enumeratorData?.firstName || "First Name"} ${
                  enumeratorData?.lastName || "Last Name"
                }`}
              </h2>
              <p className="text-gray-600">
                {enumeratorData?.emailAddress || "No email"}
              </p>
              <p className="text-gray-600">
                {enumeratorData?.phoneNumber || "No phone number"}
              </p>
            </div>
          )}

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
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Surveys Completed</h3>
              {totalResponses > 0 ? totalResponses : "-"}
            </div>
            {/* <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Pending Surveys</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Responses</h3>
            <p className="text-2xl font-bold">
              {totalResponses > 0 ? totalResponses : "-"}
            </p>
          </div>

          {/* Start Survey Section */}
          <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold">Start a New Survey</h2>
            <button
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              onClick={() => setIsSurveyOpen(true)}
            >
              <FaPlayCircle />
              <span>Start Survey</span>
            </button>
          </div>

          {/* View Data Section */}
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">View Collected Data</h2>
            <p className="text-gray-600">
              See all the data you&apos;ve gathered from your surveys.
            </p>
            <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">
              View Data
            </button>
          </div>
        </div>

        {/* Survey Modal */}
        {isSurveyOpen && (
              <SurveyForm 
                isOpen={isSurveyOpen} 
                onClose={() => setIsSurveyOpen(false)} 
                location={location}
                initialLocation={location}
              />
        )}
      </div>
    </ProtectedPage>
  );
}
