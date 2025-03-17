import React, { useState, useEffect } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import axios from "axios";
import { config, configMultiPart } from "../../configaration/Config";
import { useNavigate } from "react-router-dom";

// interface Lesson {
//   title: string;
//   description: string;
//   video?: File | null;
// }

// interface Module {
//   title: string;
//   lessons: Lesson[];
// }

// interface CourseFormData {
//   title: string;
//   courseDescription: string;
//   category: string;
//   instructorName: string;
//   aboutInstructor: string;
//   isPaid: "Free" | "Premium" | "";
//   price?: number;
//   accountNumber?: number;
//   email?: string;
//   phone?: number;
//   thumbnail?: File | null;
//   modules: Module[];
// }


const AddCourse_Pricing = () => {
  const [pricingOption, setPricingOption] = useState<"Free" | "Premium" | "">("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { formData: contextData, updateFormData, resetFormData } = useCourseForm();
  const navigate = useNavigate();

  // Sync local pricingOption with context's isPaid on mount
  useEffect(() => {
    if (contextData.isPaid) {
      setPricingOption(contextData.isPaid);
    }
  }, [contextData.isPaid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handlePricingOptionChange = (option: "Free" | "Premium") => {
    setPricingOption(option);
    updateFormData({ isPaid: option });
    if (option === "Free") {
      updateFormData({
        price: "",
        accountNumber: "",
        email: "",
        phone: "",
      });
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!pricingOption) {
  //     console.error("Please select a pricing option.");
  //     return;
  //   }

  //   setLoading(true); // Set loading to true when submission starts

  //   const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  //   const data = new FormData();

  //   data.append("title", contextData.title);
  //   data.append("courseDescription", contextData.courseDescription);
  //   data.append("category", contextData.category);
  //   data.append("instructorName", contextData.instructorName);
  //   data.append("aboutInstructor", contextData.aboutInstructor);
  //   data.append("isPaid", pricingOption);

  //   if (pricingOption === "Premium") {
  //     data.append("price", contextData.price || "");
  //     data.append("accountNumber", contextData.accountNumber || "");
  //     data.append("email", contextData.email || "");
  //     data.append("phone", contextData.phone || "");
  //   }

  //   if (contextData.thumbnail) {
  //     data.append("thumbnail", contextData.thumbnail);
  //   }

  //   contextData.modules.forEach((module, moduleIndex) => {
  //     module.lessons.forEach((lesson, lessonIndex) => {
  //       if (lesson.video) {
  //         data.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
  //       }
  //     });
  //   });

  //   try {
  //     console.log("Submitting FormData...",data);
  //     const response = await axios.post(`${API_URL}/instructor/createCourse`, data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       withCredentials: true,
  //     });

  //     console.log("Course added successfully:", response.data);
  //     resetFormData();
  //     setPricingOption("");
  //     navigate("/instructor");
  //   } catch (error) {
  //     console.error("Error adding course:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false when submission completes (success or error)
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!pricingOption) {
      console.error("Please select a pricing option.");
      return;
    }
  
    setLoading(true);
  
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    const data = new FormData();
  
    data.append("title", contextData.title);
    data.append("courseDescription", contextData.courseDescription);
    data.append("category", contextData.category);
    data.append("instructorName", contextData.instructorName);
    data.append("aboutInstructor", contextData.aboutInstructor);
    data.append("isPaid", pricingOption);
  
    if (pricingOption === "Premium") {
      data.append("price", contextData.price || "");
      data.append("accountNumber", contextData.accountNumber || "");
      data.append("email", contextData.email || "");
      data.append("phone", contextData.phone || "");
    }
  
    if (contextData.thumbnail) {
      data.append("thumbnail", contextData.thumbnail);
    }
  
    // Append module and lesson metadata
    contextData.modules.forEach((module, moduleIndex) => {
      data.append(`modules[${moduleIndex}][title]`, module.title);
      module.lessons.forEach((lesson, lessonIndex) => {
        data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][title]`, lesson.title);
        data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][lessonDescription]`, lesson.lessonDescription);
        if (lesson.video) {
          data.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
        }
      });
    });
  
    try {
      console.log("Submitting FormData...");
      const response = await axios.post(`${API_URL}/instructor/createCourse`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      console.log("Course added successfully:", response.data);
      resetFormData();
      setPricingOption("");
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Error adding course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />
      <div className="flex-1 p-6">
        <CourseProgress />
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6 text-center">
            <h2 className="text-2xl mb-4 font-semibold">Choose Pricing Plan</h2>
            <div className="flex justify-center gap-4">
              <label
                className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                  pricingOption === "Free" ? "border-violet-500" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="pricingOption"
                  value="Free"
                  className="hidden"
                  onChange={() => handlePricingOptionChange("Free")}
                />
                Free
              </label>
              <label
                className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                  pricingOption === "Premium" ? "border-violet-500" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="pricingOption"
                  value="Premium"
                  className="hidden"
                  onChange={() => handlePricingOptionChange("Premium")}
                />
                Premium
              </label>
            </div>
          </div>

          {pricingOption === "Premium" && (
            <div className="mb-6">
              <h3 className="text-xl mb-4 font-semibold text-center">Premium Plan Details</h3>
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={contextData.price || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={contextData.accountNumber || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={contextData.email || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={contextData.phone || ""}
                onChange={handleInputChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Publishing...
              </span>
            ) : (
              "Save & Publish"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse_Pricing;
