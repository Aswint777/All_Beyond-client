import api from "../utils/api";

export const alreadyEnrolledCourses = async (
  courseId: string
): Promise<boolean> => {
  try {
    const response = await api.get(`/student/alreadyEnrolledCourses/${courseId}`);
    const isEnrolled = response.data.data;
    return isEnrolled;
  } catch (error) {
    console.error(`Error checking enrollment for course ${courseId}:`, error);
    throw error;
  }
};



export const submitInstructorApplication = async (
  _id: string,
  formDataObj: FormData
): Promise<void> => {
  try {
    await api.post(`/instructor/instructorApplication/${_id}`, formDataObj, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error(`Error submitting instructor application for user ${_id}:`, error);
    throw error;
  }
};


export const fetchInstructorApplications = async (): Promise<any> => {
  try {
    const response = await api.get("/admin/AdminInstructorApplicationList");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred while fetching instructor applications.");
  }
};


export const updateInstructorStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<void> => {
  try {
    const response = await api.put("/admin/updateInstructorStatus", { Id: id, status });
    if (response.status !== 200) {
      throw new Error("Failed to update instructor status");
    }
  } catch (error: any) {
    console.error("Error updating instructor status in service:", error);
    throw error;
  }
};



export const blockUnblockUser = async (
  userId: string,
  isBlocked: boolean
): Promise<void> => {
  try {
    const response = await api.put("/admin/block_UnBlock", { userId, isBlocked });
    if (response.status !== 200) {
      throw new Error("Failed to update user block status");
    }
  } catch (error: any) {
    console.error("Error updating user block status in service:", error);
    throw error;
  }
};