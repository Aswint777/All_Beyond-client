import api from "../utils/api"; 


export const coursePayment = async (
  courseId: string,
  price: number
): Promise<string> => {
  try {
    const response = await api.post("/student/coursePayment", { courseId, price });
    return response.data.clientSecret;
  } catch (error) {
    throw error;
  }
};

export const enrollCourse = async (courseId: string): Promise<void> => {
  try {
    await api.post("/student/enroll", { courseId });
  } catch (error) {
    throw error;
  }
};

export const initializeProgress = async (courseId: string): Promise<void> => {
  try {
    await api.post("/student/initializeProgress", { courseId });
  } catch (error) {
    throw error;
  }
};