import { v4 as uuidv4 } from "uuid";
import api from "../utils/api";

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

// export const fetchCourses = async (
//   page: number,
//   limit: number,
//   search: string = "",
//   category: string = ""
// ): Promise<CoursesResponse> => {
//   try {
//     const response = await api.get("/auth/courses", {
//       params: {
//         page,
//         limit,
//         search,
//         category,
//       },
//     });
//     const { courses, totalPages } = response.data.data;
//     if (!Array.isArray(courses)) {
//       throw new Error("Courses data is not an array");
//     }
//     return { courses, totalPages };
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     throw error;
//   }
// };


export const fetchCourses = async (
  page: number,
  limit: number,
  search: string = "",
  category: string = "",
  sortOption: string = "",
  pricingFilter: string = ""
): Promise<CoursesResponse> => {
  try {
    const response = await api.get("/auth/courses", {
      params: {
        page,
        limit,
        search,
        category, 
        sort: sortOption,
        pricingOption: pricingFilter,
      },
    });
    const { courses, totalPages } = response.data.data;
    if (!Array.isArray(courses)) {
      throw new Error("Courses data is not an array");
    }
    return { courses, totalPages };
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await api.get("/auth/allCategory");
    const categories = response.data.data || [];
    if (!Array.isArray(categories)) {
      throw new Error("Categories data is not an array");
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch course details by ID
export const fetchCourseDetails = async (
  courseId: string
): Promise<CourseResponse> => {
  try {
    const response = await api.get(`/auth/courseDetails/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

// Fetch similar courses by course ID
export const fetchSimilarCourses = async (
  courseId: string
): Promise<ICourse[]> => {
  try {
    const response = await api.get(`/auth/similarCourses/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching similar courses:", error);
    throw error;
  }
};

// Instructor

export const fetchInstructorCourses = async (
  search: string = "",
  page: number,
  limit: number
): Promise<CoursesResponse> => {
  try {
    const response = await api.get("/instructor/courses", {
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

export const toggleCourseStatus = async (courseId: string): Promise<void> => {
  try {
    await api.put(`/instructor/blockCourse/${courseId}`, {});
  } catch (error) {
    console.error("Error toggling course status:", error);
    throw error;
  }
};

// Fetch course data by ID
export const  fetchCourseById = async (
  courseId: string
): Promise<CourseFormData> => {
  try {
    const response = await api.get(`/instructor/viewCourses/${courseId}`);
    const course = response.data.data;
    console.log("response :",response.data);
    

    const categoryResponse = await api.get("/instructor/courseCategories");
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
    const response = await api.get("/instructor/courseCategories");
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
    console.log('data:',data);
    
    await api.put(`/instructor/editCourse/${courseId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Fetch Student Courses
export const fetchStudentCourses = async (
  search: string = "",
  page: number,
  limit: number
): Promise<CoursesResponse> => {
  try {
    const response = await api.get("/student/courses", {
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




