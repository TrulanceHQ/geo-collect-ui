"use client";

import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
import Image from "next/image";
import ProtectedPage from "@/components/ProtectedPage";
import {
  createEnumerators,
  getSurveyResponsesByFieldCoordinator,
  fetchUserData,
  getEnumeratorCountByFieldCoordinator,
  updateUserProfile,
  // getTotalResponsesCountByFieldCoordinator,
} from "@/services/apiService";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaEdit } from "react-icons/fa";
import ResetPasswordModal from "@/components/ResetPasswordModal";

interface SurveyData {
  _id: string;
  surveyId: { title: string; subtitle: string };
  enumeratorId: {
    firstName: string;
    lastName: string;
    fieldCoordinatorId: { selectedState: string };
  };

  responses: {
    question: string;
    subquestion?: string; // New optional field for likert subquestions
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  startTime: string;
  submittedAt: string;
}

export default function FieldCoordinatorsDashboard() {
  const [fieldCoordData, setFieldCoordData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  const [enumeratorCount, setEnumeratorCount] = useState(0);
  const [totalResponsesCount, setTotalResponsesCount] = useState(0); // Add state for total responses count
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyData | null>(null);
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
        const enumcount = await getEnumeratorCountByFieldCoordinator(userId);
        setEnumeratorCount(enumcount);
        const surveyResponses = await getSurveyResponsesByFieldCoordinator(
          userId
        );
        setSurveyData(surveyResponses);
        setTotalResponsesCount(surveyResponses.length); // Update the total responses count
        setError("");
      } catch (error) {
        console.error("Error decoding token or fetching data:", error);
        console.error("Error decoding token or fetching user data:", error);
      }
    };

    fetchFieldCoordData();
  }, [isDataVisible]); // Fetch data whenever isDataVisible changes

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

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const [surveyData, setSurveyData] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true); // Start submitting
    const creatorRole = "fieldCoordinator";

    try {
      const data = await createEnumerators(emailAddress, role, creatorRole);

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
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleResetPassword = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Unauthorized: No access token found");
      return;
    }

    const decodedToken = jwtDecode<{ sub: string }>(token);
    setUserId(decodedToken.sub);
    setIsResetPasswordOpen(true);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <ProtectedPage allowedRoles={["fieldCoordinator"]} redirectPath="/">
        <button
          className="bg-red-400 text-white px-4 py-1 rounded"
          onClick={logout}
        >
          Log Out
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-1 rounded sm:w-auto"
          onClick={handleResetPassword}
        >
          Update Password
        </button>
        <div className="relative p-6">
          <h1 style={{ fontSize: "1.2rem" }}>
            <b>Field Coordinator</b>
          </h1>
          {/* Logo at the top right */}
          <div className="absolute top-4 right-6">
            <Image
              src="/geotrak-icon.png"
              alt="Company Logo"
              width={60}
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

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Surveys Completed</h3>
            <p className="text-2xl font-bold">{totalResponsesCount}</p>
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
                {/* <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleCreateEnum}
                  >
                    Submit
                  </button> */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={handleCreateEnum}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Button to toggle the survey data view */}
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

        {/* Summary Table */}
        {/* Responsive Table Container */}
        {isDataVisible && (
          <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Collected Survey Data
            </h2>
            {/* The container below restricts the table to the viewport and adds a horizontal scrollbar if needed */}
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto bg-white border border-gray-300">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left border whitespace-normal break-words">
                      Enumerator
                    </th>
                    {/* <th className="p-3 text-left border whitespace-normal break-words">
                      Start Time
                    </th> */}
                    <th className="p-3 text-left border whitespace-normal break-words">
                      Submission Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {surveyData.map((data) => (
                    <tr
                      key={data._id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedSurvey(data)}
                    >
                      <td className="p-3 border">
                        {`${data.enumeratorId.firstName} ${data.enumeratorId.lastName}`}
                      </td>
                      {/* <td className="p-3 border whitespace-normal break-words">
                        {new Date(data.startTime).toLocaleString()}
                      </td> */}
                      <td className="p-3 border whitespace-normal break-words">
                        {new Date(data.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Survey Details</h2>
              <p>
                <strong>Enumerator: </strong>
                {`${selectedSurvey.enumeratorId.firstName} ${selectedSurvey.enumeratorId.lastName}`}
              </p>

              <p>
                <strong>Start Time: </strong>
                {new Date(selectedSurvey.startTime).toLocaleString()}
              </p>
              <p>
                <strong>Submission Time: </strong>
                {new Date(selectedSurvey.submittedAt).toLocaleString()}
              </p>
              <p>
                <strong>Location: </strong>
                {selectedSurvey.location}
              </p>
              {selectedSurvey.mediaUrl && (
                <p>
                  <strong>Media: </strong>
                  <a
                    href={selectedSurvey.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Media
                  </a>
                </p>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Responses</h3>
                {selectedSurvey.responses.map((response, index) => (
                  <div key={index} className="border p-2 mt-2">
                    <p>
                      <strong>Question: </strong>
                      {response.question}
                    </p>
                    {response.subquestion && (
                      <p>
                        Subquestion:
                        {response.subquestion}
                      </p>
                    )}
                    <p>
                      <strong>Answer: </strong>
                      {response.answer}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setSelectedSurvey(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        <ResetPasswordModal
          isOpen={isResetPasswordOpen}
          onClose={() => setIsResetPasswordOpen(false)}
          userId={userId}
        />

        {/* </div> */}
      </ProtectedPage>
    </>
  );
}
