import axios from "axios";
import { config } from "../configaration/Config";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  categoryName?: string;
  instructor?: string;
  aboutInstructor?: string;
  content?: {
    moduleTitle: string;
    lessons: {
      lessonTitle: string;
      lessonDescription?: string;
      video?: string;
    }[];
  }[];
  pricingOption?: "Premium" | "Free";
  price?: number;
  accountNumber?: number;
  additionalEmail?: string;
  additionalContactNumber?: string;
  user?: {
    _id: string;
    name: string;
  };
  thumbnailUrl?: string;
  rating?: number;
  reviews?: number;
}

interface ICategory {
  _id: string;
  name: string;
  description: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CoursesResponse {
  courses: ICourse[];
  totalPages: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video: File | null | string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseFormData {
  title: string;
  courseDescription: string;
  category: string;
  aboutInstructor: string;
  isPaid: "Free" | "Premium" | "";
  price?: number | string;
  accountNumber?: number | string;
  email?: string;
  phone?: number | string;
  thumbnail?: File | null | string;
  modules: Module[];
  instructor?: string;
}

interface AverageReview {
  count: number;
  average: number;
}

interface CourseResponse {
  course: ICourse;
  reviewStatus: AverageReview;
}

// Common

// Fetch all courses with pagination, search, and category filter
export const fetchCourses = async (
  page: number,
  limit: number,
  search: string = "",
  category: string = ""
): Promise<CoursesResponse> => {
  try {
    const response = await axios.get(`${API_URL}/auth/courses`, {
      ...config,
      params: {
        page,
        limit,
        search,
        category,
      },
    });
    const { courses, totalPages } = response.data.data;
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    return { courses, totalPages };
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error; // Re-throw for component-level handling
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await axios.get(`${API_URL}/auth/allCategory`, config);
    const categories = response.data.data || [];
    if (!Array.isArray(categories)) {
      throw new Error("Categories data is not an array");
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw for component-level handling
  }
};

// Fetch course details by ID
export const fetchCourseDetails = async (
  courseId: string
): Promise<CourseResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/courseDetails/${courseId}`,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error; // Re-throw to handle in the component
  }
};

// Fetch similar courses by course ID
export const fetchSimilarCourses = async (
  courseId: string
): Promise<ICourse[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/similarCourses/${courseId}`,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching similar courses:", error);
    throw error; // Re-throw to handle in the component
  }
};

// Instructor

// Fetch instructor's courses with pagination and search
export const fetchInstructorCourses = async (
  search: string = "",
  page: number,
  limit: number
): Promise<CoursesResponse> => {
  try {
    const response = await axios.get(`${API_URL}/instructor/courses`, {
      ...config,
      params: { search, page, limit },
    });
    const { courses, totalPages } = response.data.data;
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    return { courses, totalPages };
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    throw error;
  }
};

// Toggle course status (block/unblock)
export const toggleCourseStatus = async (courseId: string): Promise<void> => {
  try {
    const response = await axios.put(
      `${API_URL}/instructor/blockCourse/${courseId}`,
      {},
      config
    );
    console.log("Course toggle response:", response.data);
  } catch (error) {
    console.error("Error toggling course status:", error);
    throw error;
  }
};

// Fetch course data by ID
export const fetchCourseById = async (
  courseId: string
): Promise<CourseFormData> => {
  try {
    const response = await axios.get(
      `${API_URL}/instructor/viewCourses/${courseId}`,
      config
    );
    const course = response.data.data;

    const categoryResponse = await axios.get(
      `${API_URL}/instructor/courseCategories`,
      {
        withCredentials: true,
      }
    );
    const categoryMap = new Map(
      categoryResponse.data.data.map((cat: any) => [cat._id, cat.name])
    );
    const category =
      categoryMap.get(course.categoryName) || course.categoryName;

    return {
      title: course.courseTitle || "",
      courseDescription: course.courseDescription || "",
      category: category || "",
      instructor: course.instructor || "",
      aboutInstructor: course.aboutInstructor || "",
      isPaid: course.pricingOption || "",
      price: course.price || "",
      accountNumber: course.accountNumber || "",
      email: course.additionalEmail || "",
      phone: course.additionalContactNumber || "",
      thumbnail: course.thumbnailUrl || null,
      modules:
        course.content?.map((mod: any) => ({
          id: mod._id || uuidv4(),
          title: mod.moduleTitle || "",
          lessons:
            mod.lessons?.map((lesson: any) => ({
              id: lesson._id || uuidv4(),
              title: lesson.lessonTitle || "",
              description: lesson.lessonDescription || "",
              video: lesson.video || null,
            })) || [],
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching course data:", error);
    throw error;
  }
};

// Fetch all course categories
export const fetchCourseCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/instructor/courseCategories`, {
      withCredentials: true,
    });
    return response.data.data.map((category: any) => category.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Update course
export const updateCourse = async (
  courseId: string,
  data: FormData
): Promise<void> => {
  try {
    const response = await axios.put(
      `${API_URL}/instructor/editCourse/${courseId}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    console.log("Course updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Fetch Student Courses
interface CoursesResponse {
  courses: ICourse[];
  totalPages: number;
}

export const fetchStudentCourses = async (
  search: string = "",
  page: number,
  limit: number
): Promise<CoursesResponse> => {
  try {
    const response = await axios.get(`${API_URL}/student/courses`, {
      ...config,
      params: { search, page, limit },
    });
    const { courses, totalPages } = response.data.data;
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    return { courses, totalPages };
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw error;
  }
};


// export const fetchStudentCourses = async (
//   search: string = "",
//   page: number,
//   limit: number
// ): Promise<CoursesResponse> => {
//   try {
//     const response = await axios.get(`${API_URL}/student/courses`, {
//       ...config,
//       params: { search, page, limit },
//     });
//     const { courses, totalPages } = response.data.data;
//     if (!Array.isArray(courses)) {
//       throw new Error("Courses data is not an array");  
//     }
//     return { courses, totalPages };
//   } catch (error) {
//     console.error("Error fetching instructor courses:", error);
//     throw error;
//   }
// };
