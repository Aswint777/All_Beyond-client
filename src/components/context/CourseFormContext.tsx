import React, { createContext, useContext, useState, ReactNode } from "react";

type Lesson = {
  title: string;
  description: string;
  video: File | null;
};

type Module = {
  title: string;
  lessons: Lesson[];
};

type CourseFormData = {
  title: string;
  description: string;
  category: string;
  instructorName: string;
  aboutInstructor: string;
  thumbnail: File | null;
  modules: Module[];
  isPaid: "Free" | "Paid" | "";
};

type CourseFormContextType = {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
  resetFormData: () => void;
};

const defaultFormData: CourseFormData = {
  title: "",
  description: "",
  category: "Personal Finance",
  instructorName: "",
  aboutInstructor: "",
  thumbnail: null,
  modules: [],
  isPaid: "",
};

const CourseFormContext = createContext<CourseFormContextType | undefined>(undefined);

export const useCourseForm = () => {
  const context = useContext(CourseFormContext);
  if (!context) {
    throw new Error("useCourseForm must be used within a CourseFormProvider");
  }
  return context;
};

export const CourseFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);

  const updateFormData = (data: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => setFormData(defaultFormData);

  return (
    <CourseFormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </CourseFormContext.Provider>
  );
};
