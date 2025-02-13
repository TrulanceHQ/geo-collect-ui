import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Replace with your API base URL

export const login = async (emailAddress: string, password: string) => {
    // console.log(emailAddress, password)
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { emailAddress, password });
    toast.success("Login successful");
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      toast.error("Invalid email or password");
    } else {
      toast.error("An error occurred. Please try again.");
    }
    throw error;
  }
};
export const createUsers = async (emailAddress: string, role: string, creatorRole: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, { emailAddress, role, creatorRole });
      toast.success("User created successful");
      return response.data;
  } catch (error) {
    console.error('Error Creating User:', error);
    throw error;
  }
};
export const createEnumerators = async (emailAddress: string, role: string, creatorRole: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-enumerator`, { emailAddress, role, creatorRole });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Add more API functions as needed