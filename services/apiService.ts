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
    const response = await axios.post(`${API_BASE_URL}/create-user`, {
      emailAddress,
      role,
      creatorRole,
    });
    toast.success("User created successful");
    return response.data;
  } catch (error) {
    console.error("Error Creating User:", error);
    throw error;
  }
};

export const createEnumerators = async (
  emailAddress: string,
  role: string,
  creatorRole: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-enumerator`, {
      emailAddress,
      role,
      creatorRole,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
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
