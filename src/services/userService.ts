import axios from "axios";
import { config } from "../configaration/Config";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const alreadyEnrolledCourses = async (courseId: string): Promise<boolean> => {
  try {

    console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
    const response = await axios.get(`${API_URL}/student/alreadyEnrolledCourses/${courseId}`, { ...config });
    console.log(response,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    
    const  isEnrolled  = response.data.data;
    console.log(isEnrolled,'isEnrolled');
    
    return isEnrolled;
  } catch (error) {
    console.error(`Error checking enrollment for course ${courseId}:`, error);
    throw error;
  }
};