// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { config } from "../../configaration/Config";
// import UserNavbar from "../../components/layout/UserNavbar";
// import BasicNavbar from "../../components/layout/BasicNavbar";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import Pagination from "../../components/reusableComponents/Pagination";

// interface ICourse {
//   _id: string;
//   courseTitle: string;
//   courseDescription?: string;
//   categoryName?: string;
//   instructor?: string;
//   aboutInstructor?: string;
//   content?: {
//     moduleTitle: string;
//     lessons: {
//       lessonTitle: string;
//       lessonDescription?: string;
//       video?: string;
//     }[];
//   }[];
//   pricingOption?: "Premium" | "Free";
//   price?: number;
//   accountNumber?: number;
//   additionalEmail?: string;
//   additionalContactNumber?: string;
//   user?: {
//     _id: string;
//     name: string;
//   };
//   thumbnailUrl?: string;
//   rating?: number;
//   reviews?: number;
// }

// interface ICategory {
//   _id: string;
//   name: string;
//   description: string;
//   isBlocked: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// const AllCourses: React.FC = () => {
//   const navigate = useNavigate();
//   const { userDetails } = useSelector((state: RootState) => state.user);
//   const [navbarKey, setNavbarKey] = useState(0);
//   const [courses, setCourses] = useState<ICourse[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState<ICategory[]>([]);
//   const limit = 6;

//   const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

//   useEffect(() => {
//     if (userDetails) {
//       setNavbarKey((prevKey) => prevKey + 1);
//     }
//   }, [userDetails]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/auth/allCategory`, config);
//         console.log("Categories Response:", response.data);
//         setCategories(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, [API_URL]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_URL}/auth/courses`, {
//           ...config,
//           params: {
//             page: currentPage,
//             limit,
//             search: searchQuery.trim(), // Ensure no extra whitespace
//             category: selectedCategory || undefined, // Send undefined if empty
//           },
//         });

//         console.log("Courses API Response:", response.data);

//         const { courses, totalPages: pages } = response.data.data;

//         if (!Array.isArray(courses)) {
//           throw new Error("Courses data is not an array");
//         }

//         setCourses(courses);
//         setTotalPages(pages || 1);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setCourses([]);
//         setTotalPages(1);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [currentPage, searchQuery, selectedCategory, API_URL]);

//   const handleViewDetails = (courseId: string) => {
//     navigate(`/courseDetails/${courseId}`);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCategory(e.target.value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       {userDetails ? <UserNavbar key={navbarKey} /> : <BasicNavbar />}

//       <div className="container mx-auto px-4 py-12 mt-11">
//         {/* Header Section */}
//         <div className="mb-12 animate-fade-in-down">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
//             Explore Our Courses
//           </h1>

//           {/* Search and Filter Section */}
//           <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-lg">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder={`Search courses${selectedCategory ? ` in ${selectedCategory}` : " across all categories"}...`}
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
//               />
//               <svg
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//             <select
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="w-full sm:w-64 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700 transition-all duration-300"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category._id} value={category.name}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Courses Section */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {Array(6).fill(0).map((_, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
//               >
//                 <div className="h-56 bg-gray-200"></div>
//                 <div className="p-6">
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
//                   <div className="h-10 bg-gray-200 rounded"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {courses.map((course, index) => (
//                 <div
//                   key={course._id}
//                   className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <div className="relative">
//                     <img
//                       src={course.thumbnailUrl || "/default-course.jpg"}
//                       alt={course.courseTitle}
//                       className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = "/default-course.jpg";
//                       }}
//                     />
//                     <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                       {course.pricingOption || "N/A"}
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
//                       {course.courseTitle}
//                     </h2>
//                     <p className="text-sm text-gray-600 mb-2">
//                       Instructor: {course.instructor || course.user?.name || "Unknown"}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-2">
//                       Category: {course.categoryName || "Uncategorized"}
//                     </p>
//                     <div className="flex items-center mb-4">
//                       <span className="text-yellow-400 mr-1">★</span>
//                       <span className="text-sm font-medium text-gray-700">
//                         {course.rating || 0} ({course.reviews || 0} Reviews)
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => handleViewDetails(course._id)}
//                       className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
//                     >
//                       Explore Course
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {courses.length === 0 && (
//               <div className="text-center mt-12 animate-fade-in">
//                 <p className="text-xl text-gray-600 font-medium">
//                   No courses found matching your criteria
//                 </p>
//                 <p className="text-gray-500 mt-2">
//                   Try adjusting your search or category filter
//                 </p>
//               </div>
//             )}

//             <div className="mt-12">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCourses;






import React, { useState } from "react";
import UserNavbar from "../layout/UserNavbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  InstructorApplicationErrors,
  validateInstructorApplication,
} from "../validation/instructorApplicationErrors";

const InstructorApplicationForm: React.FC = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    qualification: "",
    address: "",
    contactNumber: "",
    educationFile: null as File | null,
    profilePhoto: null as File | null,
    profilePhotoPreview: "",
    gender: "",
    city: "",
    country: "",
    pinNumber: "",
    email: userDetails?.email || "",
  });

  const [formErrors, setFormErrors] = useState<InstructorApplicationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors = validateInstructorApplication(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]:
        validateInstructorApplication({ ...formData, [name]: value })[name] ||
        "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
        ...(e.target.name === "profilePhoto" && {
          profilePhotoPreview: URL.createObjectURL(file),
        }),
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const API_URL = import.meta.env.VITE_REACT_APP_API_URL!;
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "educationFile" || key === "profilePhoto") {
        if (value instanceof File) {
          formDataObj.append(key, value);
        }
      } else if (value !== null && key !== "profilePhotoPreview") {
        formDataObj.append(key, String(value));
      }
    });

    try {
      const _id = userDetails?._id;
      await axios.post(
        `${API_URL}/instructor/instructorApplication/${_id}`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/InstructorApplyPage"); 
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center p-6 lg:p-10">
        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">
              Application submitted successfully!
            </span>
          </div>
        )}

        {/* Profile Photo Preview & Upload */}
        <div className="mb-8 flex flex-col items-center mt-11">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <img
              src={
                formData.profilePhotoPreview ||
                "src/assets/images/blank-profile-picture-973460_640.webp"
              } // Use dummyImage as the standard default
              alt="Profile Preview"
              className="w-32 h-32 rounded-full border-4 border-purple-200 object-cover shadow-md hover:opacity-80 transition-all duration-200"
            />
          </label>
          <input
            type="file"
            id="profilePhotoInput"
            name="profilePhoto"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            required
          />
          {formErrors.profilePhoto && (
            <p className="text-red-500 text-xs mt-2">
              {formErrors.profilePhoto}
            </p>
          )}
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Apply As Instructor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "firstName",
                "lastName",
                "age",
                "qualification",
                "address",
                "contactNumber",
                "city",
                "country",
                "pinNumber",
                "email",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    name={field}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    onChange={handleChange}
                    value={
                      typeof formData[field as keyof typeof formData] ===
                      "string"
                        ? (formData[field as keyof typeof formData] as string)
                        : ""
                    }
                    
                    disabled={field === "email"} // Disable email since it's pre-filled
                  />
                  {formErrors[field as keyof InstructorApplicationErrors] && (
                    <p className="text-red-500 text-xs mt-2">
                      {formErrors[field as keyof InstructorApplicationErrors]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                onChange={handleChange}
                value={formData.gender}
                
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && (
                <p className="text-red-500 text-xs mt-2">{formErrors.gender}</p>
              )}
            </div>

            {/* Education File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Education File (PDF)
              </label>
              <input
                type="file"
                name="educationFile"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                accept="application/pdf"
                onChange={handleFileChange}
                
              />
              {formErrors.educationFile && (
                <p className="text-red-500 text-xs mt-2">
                  {formErrors.educationFile}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InstructorApplicationForm;
