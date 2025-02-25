/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
// import { useState } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
// import jwtDecode from "jwt-decode";
// import * as jwtDecode from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (emailAddress: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      emailAddress,
      password,
    });
    // console.log(response.data);
    if (response.data?.accessToken) {
      toast.success("Login successful");
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    // console.error("Error logging in:", error);
    toast.error("Invalid email or password");
    throw error;
  }
};

export const createUsers = async (
  emailAddress: string,
  role: string,
  creatorRole: string,
  selectedState: string
) => {
  try {
    // Retrieve token from local storage (or wherever you store the user's token)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = jwtDecode(token);
    const adminId = decodedToken.sub;

    console.log(emailAddress, role, selectedState, creatorRole, adminId);
    const response = await axios.post(
      `${API_BASE_URL}/create-user`,
      {
        emailAddress,
        role,
        creatorRole,
        selectedState,
        adminId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Request payload:", {
      emailAddress,
      role,
      creatorRole,
      selectedState,
      adminId,
    });
    toast.success("User created successful");
    return response.data;
  } catch (error) {
    const errorMessage = "Failed to create user";

    toast.error(errorMessage);
    throw error;
  }
};

export const createEnumerators = async (
  emailAddress: string,
  role: string,
  creatorRole: string
) => {
  try {
    // Retrieve token from local storage (or wherever you store the user's token)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }
    const decodedToken = jwtDecode(token);
    const fieldCoordinatorId = decodedToken.sub;

    //new
    // Generate a unique ID for the enumerator
    // const enumeratorId = uuidv4();

    //new ends

    // Dynamically retrieve the selectedState for fieldCoordinator
    const getUserState = () => {
      // Replace this with your method of getting the user's state (e.g., from localStorage or API)
      const selectedState = localStorage.getItem("selectedState"); // Example with localStorage
      return selectedState || ""; // Default to an empty string if not found
    };

    const selectedState =
      creatorRole === "fieldCoordinator" ? getUserState() : "";

    console.log("Payload being sent:", {
      emailAddress,
      role,
      creatorRole,
      selectedState,
      fieldCoordinatorId,
      // enumeratorId,
    });

    const response = await axios.post(
      `${API_BASE_URL}/create-enumerator`,
      {
        emailAddress,
        role,
        creatorRole,
        selectedState,
        fieldCoordinatorId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Request payload:", {
      emailAddress,
      role,
      creatorRole,
      selectedState,
      fieldCoordinatorId,
    });
    toast.success("User created successful");
    return response.data;
  } catch (error) {
    const errorMessage = "Failed to create user";

    toast.error(errorMessage);
    throw error;
  }
};

// export const getEnumeratorCountByFieldCoordinator = async (fieldCoordinatorId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/count-enumerators/${fieldCoordinatorId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to fetch enumerator count');
//   }
// };

// export const getEnumeratorCountByFieldCoordinator = async (
//   fieldCoordinatorId: string
// ): Promise<number> => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/count-enumerators/${fieldCoordinatorId}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch enumerator count");
//   }
// };

export const getEnumeratorCountByFieldCoordinator = async (
  fieldCoordinatorId: string
): Promise<number> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/count-enumerators/${fieldCoordinatorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch enumerator count");
  }
};

export const fetchUserData = async (userId: string) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Token not found"); // Handle token absence appropriately
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/allusers/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//update user profile
interface UpdatedData {
  [key: string]: any; // You can refine this type based on your data structure
}

export const updateUserProfile = async (
  userId: string,
  updatedData: UpdatedData
): Promise<any> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Token not found"); // Handle token absence appropriately
  }

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/update-user/${userId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Error updating profile"
      );
    } else {
      throw new Error("Unexpected error occurred while updating profile");
    }
  }
};

export const submitSurvey = async (surveyData: any) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Unauthorized: No access token found");
    }

    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      throw new Error("Unauthorized: Only admin can submit surveys");
    }

    const response = await axios.post(
      `${API_BASE_URL}/create`,
      // `${API_BASE_URL}/admin/questions/create`,
      surveyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Survey submitted successfully!");
    // console.log("Request payload:", response.data);
    return response.data;
  } catch (error: any) {
    // console.log("Error submitting survey:", error);
    toast.error(error.response?.data?.message || "Failed to submit survey");
    throw error;
  }
};

export const createState = async (
  stateNames: string[],
  creatorRole: string
) => {
  try {
    // Retrieve token from local storage (or wherever you store the user's token)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const payload = { ngstates: stateNames, creatorRole };
    // console.log("Sending request payload:", JSON.stringify(payload, null, 2));
    // Make API request to create state
    const response = await axios.post(
      `${API_BASE_URL}/create-state`, // Ensure the endpoint is correct

      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure JSON format
        },
      }
    );

    // console.log("Request payload:", { ngstates: stateNames, creatorRole });
    toast.success("State created successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = "Failed to create state";

    // console.error(errorMessage, error);
    toast.error(errorMessage);
    throw error;
  }
};

interface StateResponse {
  // states: string[];
  states: {
    ngstates: string[];
  }[];
  total: number;
}

// export const fetchTotalStates = async (): Promise<number> => {
export const fetchTotalStates = async (): Promise<StateResponse> => {
  try {
    const token = localStorage.getItem("accessToken"); // Retrieve token from storage

    if (!token) {
      // console.error("No authentication token found");
      return { states: [], total: 0 };
      throw new Error("No authentication token found");
    }

    // console.log("Token:", token); // Debug token retrieval
    const response = await axios.get(`${API_BASE_URL}/view-states`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in request
      },
    });
    console.log("States Response:", response.data); // Debug API response

    // Ensure response format is correct
    if (
      !Array.isArray(response.data.states) ||
      typeof response.data.total !== "number"
    ) {
      // console.error("Unexpected response format:", response.data);
      return { states: [], total: 0 };
    }
    return { states: response.data.states, total: response.data.total };
  } catch (error) {
    // console.error("Error fetching total states:", error);
    return { states: [], total: 0 };
  }
};
export const fetchUsersPerRole = async (): Promise<Record<string, number>> => {
  try {
    const token = localStorage.getItem("accessToken"); // Retrieve token from storage

    if (!token) {
      return {};
    }

    const response = await axios.get(`${API_BASE_URL}/user-count`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in request
      },
    });

    return response.data;
  } catch (error) {
    return {};
  }
};

// Define the User type
export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  role: "admin" | "enumerator" | "fieldCoordinator";
  creatorRole?: "admin" | "enumerator" | "fieldCoordinator";
  selectedState?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  gender?: "male" | "female";
  phoneNumber?: string;
  image?: string;
}

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return [];
  }
};
export const fetchQuestionnaires = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enumerator/survey/all`);
    // const surveyId = response.data?.[0]?.id;

    return { surveys: response.data };
    // return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const submitQuestionnaire = async (questionnaireData: any) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Unauthorized: No access token found");
    }
    const response = await axios.post(
      `${API_BASE_URL}/enumerator/survey/submit`,
      questionnaireData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Survey submitted successfully!");
    // console.log("response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message === "Token verification failed") {
      toast.error("Failed to submit survey");
    }
    throw error;
  }
};

export const fetchEnumeratorResponses = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/enumerator/survey/responses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
