import React, { useState, useEffect } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import axios from "axios";
import { config, configMultiPart } from "../../configaration/Config";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

interface Lesson {
  title: string;
  description: string;
  video?: File | null;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface CourseFormData {
  title: string;
  courseDescription: string;
  category: string;
  instructorName: string;
  aboutInstructor: string;
  isPaid: "Free" | "Premium" | "";
  price?: number | string;
  accountNumber?: number | string;
  email?: string;
  phone?: number | string;
  thumbnail?: File | null;
  modules: Module[];
}

const validationSchema = Yup.object().shape({
  isPaid: Yup.string()
    .oneOf(["Free", "Premium"], "Please select a pricing option")
    .required("Pricing option is required"),
  price: Yup.number()
    .when("isPaid", {
      is: "Premium",
      then: (schema) =>
        schema
          .required("Price is required for Premium courses")
          .positive("Price must be a positive number")
          .typeError("Price must be a number"),
    })
    .nullable(),
  accountNumber: Yup.number()
    .when("isPaid", {
      is: "Premium",
      then: (schema) =>
        schema
          .required("Account number is required for Premium courses")
          .typeError("Account number must be a number"),
    })
    .nullable(),
  email: Yup.string()
    .when("isPaid", {
      is: "Premium",
      then: (schema) =>
        schema
          .email("Invalid email format")
          .required("Email is required for Premium courses"),
    })
    .nullable(),
  phone: Yup.number()
    .when("isPaid", {
      is: "Premium",
      then: (schema) =>
        schema
          .required("Phone number is required for Premium courses")
          .typeError("Phone number must be a number"),
    })
    .nullable(),
});

const AddCourse_Pricing: React.FC = () => {
  const [pricingOption, setPricingOption] = useState<"Free" | "Premium" | "">("");
  const [loading, setLoading] = useState(false);
  const { formData: contextData, updateFormData, resetFormData } = useCourseForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (contextData.isPaid) {
      setPricingOption(contextData.isPaid);
    }
  }, [contextData.isPaid]);

  const initialValues: Partial<CourseFormData> = {
    isPaid: contextData.isPaid || "",
    price: contextData.price || "",
    accountNumber: contextData.accountNumber || "",
    email: contextData.email || "",
    phone: contextData.phone || "",
  };

  const handleSubmit = async (
    values: Partial<CourseFormData>,
    { setSubmitting }: FormikHelpers<Partial<CourseFormData>>
  ) => {
    if (!values.isPaid) {
      console.error("Please select a pricing option.");
      setSubmitting(false);
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
    data.append("isPaid", values.isPaid);

    if (values.isPaid === "Premium") {
      data.append("price", values.price?.toString() || "");
      data.append("accountNumber", values.accountNumber?.toString() || "");
      data.append("email", values.email || "");
      data.append("phone", values.phone?.toString() || "");
    }

    if (contextData.thumbnail) {
      data.append("thumbnail", contextData.thumbnail);
    }

    contextData.modules.forEach((module, moduleIndex) => {
      data.append(`modules[${moduleIndex}][title]`, module.title);
      module.lessons.forEach((lesson, lessonIndex) => {
        data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][title]`, lesson.title);
        data.append(
          `modules[${moduleIndex}][lessons][${lessonIndex}][lessonDescription]`,
          lesson.lessonDescription
        );
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
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />
      <div className="flex-1 p-6">
        <CourseProgress />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <div className="mb-6 text-center">
                <h2 className="text-2xl mb-4 font-semibold">Choose Pricing Plan</h2>
                <div className="flex justify-center gap-4">
                  <label
                    className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                      values.isPaid === "Free" ? "border-violet-500" : "border-gray-300"
                    }`}
                  >
                    <Field
                      type="radio"
                      name="isPaid"
                      value="Free"
                      className="hidden"
                      onClick={() => {
                        setPricingOption("Free");
                        setFieldValue("isPaid", "Free");
                        updateFormData({
                          isPaid: "Free",
                          price: "",
                          accountNumber: "",
                          email: "",
                          phone: "",
                        });
                      }}
                    />
                    Free
                  </label>
                  <label
                    className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                      values.isPaid === "Premium" ? "border-violet-500" : "border-gray-300"
                    }`}
                  >
                    <Field
                      type="radio"
                      name="isPaid"
                      value="Premium"
                      className="hidden"
                      onClick={() => {
                        setPricingOption("Premium");
                        setFieldValue("isPaid", "Premium");
                        updateFormData({ isPaid: "Premium" });
                      }}
                    />
                    Premium
                  </label>
                </div>
                {errors.isPaid && touched.isPaid && (
                  <div className="text-red-500 text-sm mt-2">{errors.isPaid}</div>
                )}
              </div>

              {values.isPaid === "Premium" && (
                <div className="mb-6">
                  <h3 className="text-xl mb-4 font-semibold text-center">Premium Plan Details</h3>
                  <Field
                    type="text"
                    name="price"
                    placeholder="Price"
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("price", e.target.value);
                      updateFormData({ price: e.target.value });
                    }}
                  />
                  {errors.price && touched.price && (
                    <div className="text-red-500 text-sm mb-2">{errors.price}</div>
                  )}

                  <Field
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("accountNumber", e.target.value);
                      updateFormData({ accountNumber: e.target.value });
                    }}
                  />
                  {errors.accountNumber && touched.accountNumber && (
                    <div className="text-red-500 text-sm mb-2">{errors.accountNumber}</div>
                  )}

                  <Field
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("email", e.target.value);
                      updateFormData({ email: e.target.value });
                    }}
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mb-2">{errors.email}</div>
                  )}

                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("phone", e.target.value);
                      updateFormData({ phone: e.target.value });
                    }}
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm mb-2">{errors.phone}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
                disabled={isSubmitting || loading}
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCourse_Pricing;






// import React, { useState, useEffect } from "react";
// import InstructorSidebar from "../../components/layout/InstructorSidebar";
// import CourseProgress from "../../components/reusableComponents/CourseProgress";
// import { useCourseForm } from "../../components/context/CourseFormContext";
// import axios from "axios";
// import { config, configMultiPart } from "../../configaration/Config";
// import { useNavigate } from "react-router-dom";

// // interface Lesson {
// //   title: string;
// //   description: string;
// //   video?: File | null;
// // }

// // interface Module {
// //   title: string;
// //   lessons: Lesson[];
// // }

// // interface CourseFormData {
// //   title: string;
// //   courseDescription: string;
// //   category: string;
// //   instructorName: string;
// //   aboutInstructor: string;
// //   isPaid: "Free" | "Premium" | "";
// //   price?: number;
// //   accountNumber?: number;
// //   email?: string;
// //   phone?: number;
// //   thumbnail?: File | null;
// //   modules: Module[];
// // }


// const AddCourse_Pricing = () => {
//   const [pricingOption, setPricingOption] = useState<"Free" | "Premium" | "">("");
//   const [loading, setLoading] = useState(false); // Add loading state
//   const { formData: contextData, updateFormData, resetFormData } = useCourseForm();
//   const navigate = useNavigate();

//   // Sync local pricingOption with context's isPaid on mount
//   useEffect(() => {
//     if (contextData.isPaid) {
//       setPricingOption(contextData.isPaid);
//     }
//   }, [contextData.isPaid]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//   };

//   const handlePricingOptionChange = (option: "Free" | "Premium") => {
//     setPricingOption(option);
//     updateFormData({ isPaid: option });
//     if (option === "Free") {
//       updateFormData({
//         price: "",
//         accountNumber: "",
//         email: "",
//         phone: "",
//       });
//     }
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     if (!pricingOption) {
//       console.error("Please select a pricing option.");
//       return;
//     }
  
//     setLoading(true);
  
//     const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
//     const data = new FormData();
  
//     data.append("title", contextData.title);
//     data.append("courseDescription", contextData.courseDescription);
//     data.append("category", contextData.category);
//     data.append("instructorName", contextData.instructorName);
//     data.append("aboutInstructor", contextData.aboutInstructor);
//     data.append("isPaid", pricingOption);
  
//     if (pricingOption === "Premium") {
//       data.append("price", contextData.price || "");
//       data.append("accountNumber", contextData.accountNumber || "");
//       data.append("email", contextData.email || "");
//       data.append("phone", contextData.phone || "");
//     }
  
//     if (contextData.thumbnail) {
//       data.append("thumbnail", contextData.thumbnail);
//     }
  
//     // Append module and lesson metadata
//     contextData.modules.forEach((module, moduleIndex) => {
//       data.append(`modules[${moduleIndex}][title]`, module.title);
//       module.lessons.forEach((lesson, lessonIndex) => {
//         data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][title]`, lesson.title);
//         data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][lessonDescription]`, lesson.lessonDescription);
//         if (lesson.video) {
//           data.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
//         }
//       });
//     });
  
//     try {
//       console.log("Submitting FormData...");
//       const response = await axios.post(`${API_URL}/instructor/createCourse`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
  
//       console.log("Course added successfully:", response.data);
//       resetFormData();
//       setPricingOption("");
//       navigate("/instructor/courses");
//     } catch (error) {
//       console.error("Error adding course:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <InstructorSidebar />
//       <div className="flex-1 p-6">
//         <CourseProgress />
//         <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl mb-4 font-semibold">Choose Pricing Plan</h2>
//             <div className="flex justify-center gap-4">
//               <label
//                 className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
//                   pricingOption === "Free" ? "border-violet-500" : "border-gray-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="pricingOption"
//                   value="Free"
//                   className="hidden"
//                   onChange={() => handlePricingOptionChange("Free")}
//                 />
//                 Free
//               </label>
//               <label
//                 className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
//                   pricingOption === "Premium" ? "border-violet-500" : "border-gray-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="pricingOption"
//                   value="Premium"
//                   className="hidden"
//                   onChange={() => handlePricingOptionChange("Premium")}
//                 />
//                 Premium
//               </label>
//             </div>
//           </div>

//           {pricingOption === "Premium" && (
//             <div className="mb-6">
//               <h3 className="text-xl mb-4 font-semibold text-center">Premium Plan Details</h3>
//               <input
//                 type="text"
//                 name="price"
//                 placeholder="Price"
//                 value={contextData.price || ""}
//                 onChange={handleInputChange}
//                 className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 name="accountNumber"
//                 placeholder="Account Number"
//                 value={contextData.accountNumber || ""}
//                 onChange={handleInputChange}
//                 className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email ID"
//                 value={contextData.email || ""}
//                 onChange={handleInputChange}
//                 className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone Number"
//                 value={contextData.phone || ""}
//                 onChange={handleInputChange}
//                 className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
//           )}

//           <button
//             type="submit"
//             className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400"
//             disabled={loading} // Disable button while loading
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-2 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                   />
//                 </svg>
//                 Publishing...
//               </span>
//             ) : (
//               "Save & Publish"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCourse_Pricing;
