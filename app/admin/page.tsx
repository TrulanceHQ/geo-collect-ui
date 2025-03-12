/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  createState,
  createUsers,
  fetchSurveyResponseCount,
  fetchTotalStates,
  fetchUserData,
  fetchUsersPerRole,
  updateUserProfile,
} from "@/services/apiService"; // Make sure to add createState API
import ProtectedPage from "@/components/ProtectedPage";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ResetPasswordModal from "@/components/ResetPasswordModal";

export default function DashboardPage() {
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  const [isEditMode, setIsEditMode] = useState(false); // Toggle Edit mode
  const [updatedAdminData, setUpdatedAdminData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
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
        setAdminData({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.emailAddress,
          phoneNumber: data.phoneNumber,
        });

        setUpdatedAdminData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          emailAddress: data.emailAddress || "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (error) {
        console.error("Error decoding token or fetching user data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedAdminData((prevData) => ({
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
      await updateUserProfile(userId, updatedAdminData);
      setAdminData(updatedAdminData); // Update the state with the new data
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
  const [emailAddress, setEmail] = useState("");
  const [role, setRole] = useState("enumerator");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isStateFormOpen, setIsStateFormOpen] = useState(false); // State for creating states
  const [stateName, setStateName] = useState<string[]>([]);
  const [newState, setNewState] = useState(""); // Temporary input for a single state
  const [totalStates, setTotalStates] = useState<number>(0); // Store total count
  const [surveyResponseCount, setSurveyResponseCount] = useState(0); // Add this line

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [userId, setUserId] = useState("");
  //fetch states from backend for add user
  const [selectedState, setSelectedState] = useState(""); // State for selected state
  const [states, setStates] = useState<string[]>([]); // Array to hold fetched states
  const [stateSuccess, setStateSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch states when component mounts
  useEffect(() => {
    const loadStates = async () => {
      const { total, states: fetchedStates } = await fetchTotalStates();
      setTotalStates(total);

      // Extract the ngstates from the fetched states
      if (fetchedStates.length > 0) {
        setStates(fetchedStates[0]?.ngstates || []);
      }
    };

    loadStates();
  }, []);

  const [userCounts, setUserCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const getUserCounts = async () => {
      const data = await fetchUsersPerRole();
      setUserCounts(data); // Now it correctly sets the state
    };

    getUserCounts();
  }, []);

  //new
  useEffect(() => {
    const getResponseCount = async () => {
      const count = await fetchSurveyResponseCount();
      setSurveyResponseCount(count);
    };

    getResponseCount();
  }, []);

  const handleCreateUser = async () => {
    setIsSubmitting(true);
    const creatorRole = "admin";
    try {
      const data = await createUsers(
        emailAddress,
        role,
        creatorRole,
        selectedState
      );
      setIsFormOpen(false);
      setError("");
      toast.success("User created successfully!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          setError("You do not have permission to create users.");
          toast.error("You do not have permission to create users.");
        } else if (
          error.response?.status === 409 &&
          error.response?.data?.message ===
            "Email address has been used by another customer"
        ) {
          setError("Email address has been used by another customer.");
          toast.error("Email address has been used by another customer.");
        } else {
          setError("Failed to create user. Please try again.");
          toast.error("Failed to create user. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
      setSuccess("");
    } finally {
      setIsSubmitting(false); // Hide "Submitting..."
    }
  };

  const handleCreateState = async () => {
    if (stateName.length === 0) {
      setError("Please add at least one state.");
      return;
    }
    setIsSubmitting(true); // Show "Submitting..."
    const creatorRole = "admin";
    try {
      const data = await createState(stateName, creatorRole);

      setIsStateFormOpen(false);
      setStateName([]); // Reset the state list after success
      setError("");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.status === 403
            ? "You do not have permission to create states."
            : "Failed to create states. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      setStateSuccess("");
    } finally {
      setIsSubmitting(false); // Hide "Submitting..."
    }
  };

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

  return (
    <ProtectedPage allowedRoles={["admin"]} redirectPath="/">
      <div className="p-6">
        <button
          className="bg-gray-400 text-white px-4 py-1 rounded w-full sm:w-auto"
          onClick={handleResetPassword}
        >
          Update Password
        </button>
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
          <div className="flex-1 text-center md:text-left">
            {/* Profile Data */}
            {isEditMode ? (
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={updatedAdminData.firstName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md mb-2"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={updatedAdminData.lastName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md mb-2"
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  name="emailAddress"
                  value={updatedAdminData.emailAddress}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md mb-2"
                  placeholder="Email Address"
                  disabled // This will disable editing the email field
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={updatedAdminData.phoneNumber}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md mb-2"
                  placeholder="Phone Number"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">
                  {`${adminData?.firstName || "First Name"} ${
                    adminData?.lastName || "Last Name"
                  }`}
                </h2>
                <p className="text-gray-600">
                  {adminData?.emailAddress || "No email"}
                </p>
                <p className="text-gray-600">
                  {adminData?.phoneNumber || "No phone number"}
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
        </div>

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

        {/* Add User Button */}
        <div className="mt-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            + Add User
          </button>
        </div>

        {/* Create State Button */}
        <div className="mt-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={() => setIsStateFormOpen(true)} // Open the state form modal
          >
            + Add State
          </button>
        </div>

        {/* State Creation Form (Modal) */}
        {isStateFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create State</h2>

              {/* State Name Input */}
              <label className="block mb-2 font-medium">State Name:</label>
              {/* <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter state name"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              /> */}
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter state name"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
              />

              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() => {
                  if (newState.trim()) {
                    setStateName([...stateName, newState.trim()]);
                    setNewState(""); // Clear input after adding
                  }
                }}
              >
                Add
              </button>

              <div className="mt-2">
                {stateName.map((state, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-700">{state}</span>
                    <button
                      className="text-red-500"
                      onClick={() =>
                        setStateName(stateName.filter((_, i) => i !== index))
                      }
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsStateFormOpen(false)} // Close the state form
                >
                  Cancel
                </button>
                {/* <button
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={handleCreateState}
                >
                  Submit
                </button> */}
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={handleCreateState}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Creation Form (Modal) */}
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
                value={emailAddress}
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
                <option value="fieldCoordinator">Field Coordinator</option>
                <option value="enumerator">Enumerator</option>
              </select>

              {/* States Dropdown */}
              <label className="block mb-2 font-medium">State:</label>
              <select
                className="w-full p-2 border rounded-md mb-4"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select a state</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={handleCreateUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Display */}
        {success && <div className="mt-4 text-green-500">{success}</div>}
        {stateSuccess && (
          <div className="mt-4 text-green-500">{stateSuccess}</div>
        )}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Data Collected</h3>
            <p className="text-2xl font-bold">{surveyResponseCount}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total States</h3>
            <p className="text-2xl font-bold">{totalStates}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Field Coordinators</h3>
            <p className="text-2xl font-bold">
              {userCounts["fieldCoordinator"] ?? 0}
            </p>
            {/* <p className="text-2xl font-bold">{userCounts.fieldCoordinator ?? 0}</p> */}
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Enumerators</h3>
            <p className="text-2xl font-bold">
              {userCounts["enumerator"] ?? 0}
            </p>
            {/* <p className="text-2xl font-bold">{userCounts.enumerator ?? 0}</p> */}
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        userId={userId}
      />

      {/* </div> */}
    </ProtectedPage>
  );
}
