import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Replace with your API base URL

export const login = async (emailAddress: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      emailAddress,
      password,
    });
    console.log(response.data);
    if (response.data?.accessToken) {
      toast.success("Login successful");
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    toast.error("Invalid email or password");
    throw error;
  }
};

export const createUsers = async (
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
    const response = await axios.post(
      `${API_BASE_URL}/create-user`,
      {
        emailAddress,
        role,
        creatorRole,
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
    const response = await axios.post(
      `${API_BASE_URL}/create-enumerator`,
      {
        emailAddress,
        role,
        creatorRole,
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
    });
    toast.success("User created successful");
    return response.data;
  } catch (error) {
    const errorMessage = "Failed to create user";

    toast.error(errorMessage);
    throw error;
    //  catch (error) {
    //   console.error("Error logging in:", error);
    //   throw error;
  }
};

export const fetchQuestionnaires = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/enumerator/questions/all`);
    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Add more API functions as needed

// export const createSurvey = async (
//   title: string,
//   subTitle: string,
//   questions: string
// ) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/admin/questions/create`,
//       { title, subTitle, questions }
//     );
//     toast.success("Survey created successfully!");
//     return response.data;
//   } catch (error) {
//     console.error("Error creating survey:", error);
//     toast.error("Failed to create survey");
//     throw error;
//   }
// };

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
      `http://localhost:5000/admin/questions/create`,
      surveyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Survey submitted successfully!");
    return response.data;
  } catch (error: any) {
    console.error("Error submitting survey:", error);
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
    console.log("Sending request payload:", JSON.stringify(payload, null, 2));
    // Make API request to create state
    const response = await axios.post(
      `http://localhost:5000/api/v1/admin/create-state`, // Ensure the endpoint is correct

      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure JSON format
        },
      }
    );

    console.log("Request payload:", { ngstates: stateNames, creatorRole });
    toast.success("State created successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = "Failed to create state";

    console.error(errorMessage, error);
    toast.error(errorMessage);
    throw error;
  }
};
