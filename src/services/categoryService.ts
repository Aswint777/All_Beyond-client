import api from "../utils/api";

interface CategoryFormData {
  name: string;
  description: string;
}

export const addCategory = async (formData: CategoryFormData): Promise<void> => {
  try {
    const response = await api.post("/admin/addCategory", formData);
    if (response.status !== 201) {
      throw new Error("Failed to add category");
    }
  } catch (error: any) {
    console.error("Error adding category in service:", error);
    throw error;
  }
};