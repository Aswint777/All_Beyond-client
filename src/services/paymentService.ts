import axios from "axios";
import { config } from "../configaration/Config";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const coursePayment = async (courseId: string, price: number): Promise<string> => {
  try {
    console.log("courseId in payment service:", courseId);
    console.log("price in payment service:", price);
    const response = await axios.post(
      `${API_URL}/student/coursePayment`,
      { courseId, price },
      config
    );
    console.log("Response from coursePayment:", response.data);
    return response.data.clientSecret;
  } catch (error) {
    console.log("Error in course payment:", error);
    throw error;
  }
};

export const enrollCourse = async (courseId: string): Promise<void> => {
  try {
    console.log("courseId in enrollFreeCourse:", courseId);
    const response = await axios.post(
      `${API_URL}/student/enroll`, // Assuming this is your free course enrollment endpoint
      { courseId },
      config
    );
    console.log("Enrollment response:", response.data);
  } catch (error) {
    console.log("Error in enrollFreeCourse:", error);
    throw error;
  }
};

export const initializeProgress = async (courseId: string): Promise<void> => {
  try {
    console.log("courseId in initializeProgress:", courseId);
    const response = await axios.post(
      `${API_URL}/student/initializeProgress`, // Assuming this is your free course enrollment endpoint
      { courseId },
      config
    );
    console.log("Enrollment response:", response.data);
  } catch (error) {
    console.log("Error in enrollFreeCourse:", error);
    throw error;
  }
};