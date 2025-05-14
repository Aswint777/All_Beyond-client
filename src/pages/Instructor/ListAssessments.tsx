// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios, { AxiosError } from "axios";
// import { RootState } from "../../redux/store";
// import { ROUTES } from "../../utils/paths";
// import { Edit, Plus, X, Search } from "lucide-react";
// import Pagination from "../../components/reusableComponents/Pagination";
// import { debounce } from "lodash";
// import UserNavbar from "../../components/layout/UserNavbar";
// import InstructorSidebar from "../../components/layout/InstructorSidebar";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

// interface AssessmentResult {
//   studentName: string;
//   marks: number;
//   attempts: number;
//   passed: boolean | undefined;
// }

// interface Question {
//   courseId: string;
//   question: string;
//   options: string[];
//   correctOption: number;
// }

// interface Assessment {
//   id: string;
//   courseId: string;
//   questions: Question[];
//   createdAt: string;
//   results?: AssessmentResult[];
// }

// interface CourseWithAssessment {
//   id: string;
//   title: string;
//   assessment?: Assessment;
// }

// const ListAssessments: React.FC = () => {
//   const { userDetails, loading } = useSelector((state: RootState) => state.user);
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<CourseWithAssessment[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [modalCourseId, setModalCourseId] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchData = useCallback(
//     async (currentPage: number, query: string) => {
//       try {
//         console.log(`Fetching data: page=${currentPage}, search=${query}`);
//         const response = await axios.get<{
//           success: boolean;
//           data: { courses: CourseWithAssessment[]; totalPages: number };
//         }>(
//           `${API_URL}/instructor/courses-with-assessments?page=${currentPage}&limit=6&search=${encodeURIComponent(query)}`,
//           { withCredentials: true }
//         );

//         console.log("API Response:", response.data);

//         if (response.data.success) {
//           setCourses(response.data.data.courses);
//           setTotalPages(response.data.data.totalPages);
//           setError(null);
//         } else {
//           setError("No courses found for the given search criteria");
//           setCourses([]);
//           setTotalPages(1);
//         }
//       } catch (err: unknown) {
//         const error = err as AxiosError<{ message?: string }>;
//         console.error("Fetch data error:", error);
//         setError(error.response?.data?.message || "Error fetching courses");
//         setCourses([]);
//         setTotalPages(1);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     []
//   );

//   const debouncedFetchData = useCallback(
//     debounce((query: string, currentPage: number) => {
//       fetchData(currentPage, query);
//     }, 500),
//     [fetchData]
//   );

//   useEffect(() => {
//     if (loading) return;
//     if (!userDetails?._id || userDetails?.role !== "instructor") {
//       navigate("/login");
//       return;
//     }

//     debouncedFetchData(searchQuery, page);
//     return () => {
//       debouncedFetchData.cancel();
//     };
//   }, [userDetails, loading, navigate, page, searchQuery, debouncedFetchData]);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setPage(1);
//   };

//   const openModal = (courseId: string) => {
//     setModalCourseId(courseId);
//   };

//   const closeModal = () => {
//     setModalCourseId(null);
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center gap-4">
//           <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-800 text-xl font-semibold tracking-tight">Loading Assessments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userDetails?._id || userDetails?.role !== "instructor") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-red-600 text-lg font-semibold bg-red-50 px-6 py-3 rounded-lg shadow-sm">
//           Access Denied: Instructors Only
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <UserNavbar />
//       <div className="flex min-h-screen bg-gray-50">
//         <div className="flex w-64 bg-white shadow-lg">
//           <InstructorSidebar />
//         </div>
//         <main className="flex-1 pt-16">
//           <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center animate-fade-in-down tracking-tight">
//               Course Assessments
//             </h1>
//             {error && (
//               <div className="mb-8 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm animate-fade-in" aria-live="polite">
//                 <p role="alert" className="text-sm font-medium">{error}</p>
//               </div>
//             )}
//             <div className="mb-8 flex justify-center">
//               <div className="relative w-full max-w-md">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   placeholder="Search courses..."
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm"
//                   aria-label="Search courses"
//                 />
//                 <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//             <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in-up">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
//                       >
//                         Course Title
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
//                       >
//                         Students
//                       </th>
//                       <th
//                         scope="col"
//                         className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
//                       >
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {courses.length === 0 ? (
//                       <tr>
//                         <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
//                           {searchQuery ? "No courses match your search." : "No courses found."}
//                         </td>
//                       </tr>
//                     ) : (
//                       courses.map((course) => {
//                         const studentResults = course.assessment?.results || [];
//                         return (
//                           <tr
//                             key={course.id}
//                             className="hover:bg-indigo-50 transition-all duration-200"
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {course.title}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                               <button
//                                 onClick={() => openModal(course.id)}
//                                 className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
//                                 aria-label={`View students for ${course.title}`}
//                                 disabled={!course.assessment || studentResults.length === 0}
//                               >
//                                 {course.assessment
//                                   ? studentResults.length > 0
//                                     ? `${studentResults.length} Student${studentResults.length > 1 ? 's' : ''}`
//                                     : "No Students"
//                                   : "No Assessment"}
//                               </button>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                               <button
//                                 onClick={() =>
//                                   navigate(
//                                     course.assessment
//                                       ? `${ROUTES.INSTRUCTOR}${ROUTES.EDIT_ASSESSMENT}`
//                                       : `${ROUTES.INSTRUCTOR}${ROUTES.CREATE_ASSESSMENT}`,{ state: { courseId: course.id, courseTitle: course.title } }
//                                   )
//                                 }
//                                 className={`inline-flex items-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${
//                                   course.assessment
//                                     ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:ring-indigo-500"
//                                     : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600"
//                                 }`}
//                                 aria-label={
//                                   course.assessment
//                                     ? `Edit assessment for ${course.title}`
//                                     : `Create assessment for ${course.title}`
//                                 }
//                               >
//                                 {course.assessment ? (
//                                   <>
//                                     <Edit className="h-4 w-4 mr-2" />
//                                     Edit
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Create
//                                   </>
//                                 )}
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             {totalPages > 1 && (
//               <div className="mt-8 flex justify-center">
//                 <Pagination
//                   currentPage={page}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             )}
//           </div>

//           {modalCourseId && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-slide-in">
//               <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl transform transition-all duration-300">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Results: {courses.find((c) => c.id === modalCourseId)?.title}
//                   </h2>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-400 hover:text-gray-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
//                     aria-label="Close modal"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//                 {(() => {
//                   const course = courses.find((c) => c.id === modalCourseId);
//                   const studentResults = course?.assessment?.results || [];
//                   if (!course?.assessment || studentResults.length === 0) {
//                     return (
//                       <p className="text-gray-500 text-center py-4 text-sm font-medium">
//                         No student results available.
//                       </p>
//                     );
//                   }
//                   return (
//                     <div className="space-y-4">
//                       {studentResults.map((result, index) => (
//                         <div
//                           key={index}
//                           className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200"
//                         >
//                           <p className="text-sm text-gray-700 mb-1">
//                             <strong className="font-semibold text-gray-900">Student:</strong> {result.studentName}
//                           </p>
//                           <p className="text-sm text-gray-700 mb-1">
//                             <strong className="font-semibold text-gray-900">Marks:</strong> {result.marks}
//                           </p>
//                           <p className="text-sm text-gray-700 mb-1">
//                             <strong className="font-semibold text-gray-900">Attempts:</strong> {result.attempts}
//                           </p>
//                           <p className="text-sm text-gray-700">
//                             <strong className="font-semibold text-gray-900">Status:</strong>{" "}
//                             <span
//                               className={
//                                 result.attempts === 0
//                                   ? "text-yellow-600 font-medium"
//                                   : result.passed
//                                   ? "text-green-600 font-medium"
//                                   : result.passed === undefined
//                                   ? "text-gray-600 font-medium"
//                                   : "text-red-600 font-medium"
//                               }
//                             >
//                               {result.attempts === 0
//                                 ? "Pending"
//                                 : result.passed
//                                 ? "Passed"
//                                 : result.passed === undefined
//                                 ? "Not Evaluated"
//                                 : "Failed"}
//                             </span>
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   );
//                 })()}
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ListAssessments;





import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import { ROUTES } from "../../utils/paths";
import { Edit, Plus, X, Search } from "lucide-react";
import Pagination from "../../components/reusableComponents/Pagination";
import { debounce } from "lodash";
import UserNavbar from "../../components/layout/UserNavbar";
import InstructorSidebar from "../../components/layout/InstructorSidebar";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface AssessmentResult {
  studentName: string;
  marks: number;
  attempts: number;
  passed: boolean | undefined;
}

interface Question {
  courseId: string;
  question: string;
  options: string[];
  correctOption: number;
}

interface Assessment {
  id: string;
  courseId: string;
  questions: Question[];
  createdAt: string;
  results?: AssessmentResult[];
}

interface CourseWithAssessment {
  id: string;
  title: string;
  assessment?: Assessment;
}

const ListAssessments: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithAssessment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalCourseId, setModalCourseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    async (currentPage: number, query: string) => {
      try {
        console.log(`Fetching data: page=${currentPage}, search=${query}`);
        const response = await axios.get<{
          success: boolean;
          data: { courses: CourseWithAssessment[]; totalPages: number };
        }>(
          `${API_URL}/instructor/courses-with-assessments?page=${currentPage}&limit=6&search=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          setCourses(response.data.data.courses);
          setTotalPages(response.data.data.totalPages);
          setError(null);
        } else {
          setError("No courses found for the given search criteria");
          setCourses([]);
          setTotalPages(1);
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Fetch data error:", error);
        setError(error.response?.data?.message || "Error fetching courses");
        setCourses([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const debouncedFetchData = useCallback(
    debounce((query: string, currentPage: number) => {
      fetchData(currentPage, query);
    }, 500),
    [fetchData]
  );

  useEffect(() => {
    if (loading) return;
    if (!userDetails?._id || userDetails?.role !== "instructor") {
      navigate("/login");
      return;
    }

    debouncedFetchData(searchQuery, page);
    return () => {
      debouncedFetchData.cancel();
    };
  }, [userDetails, loading, navigate, page, searchQuery, debouncedFetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const openModal = (courseId: string) => {
    setModalCourseId(courseId);
  };

  const closeModal = () => {
    setModalCourseId(null);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-800 text-xl font-semibold tracking-tight">Loading Assessments...</p>
        </div>
      </div>
    );
  }

  if (!userDetails?._id || userDetails?.role !== "instructor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold bg-red-50 px-6 py-3 rounded-lg shadow-sm">
          Access Denied: Instructors Only
        </p>
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex w-64 bg-white shadow-lg">
          <InstructorSidebar />
        </div>
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center animate-fade-in-down tracking-tight">
              Course Assessments
            </h1>
            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm animate-fade-in" aria-live="polite">
                <p role="alert" className="text-sm font-medium">{error}</p>
              </div>
            )}
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search courses..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm"
                  aria-label="Search courses"
                />
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in-up">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Course Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Students
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                          {searchQuery ? "No courses match your search." : "No courses found."}
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => {
                        const studentResults = course.assessment?.results || [];
                        return (
                          <tr
                            key={course.id}
                            className="hover:bg-indigo-50 transition-all duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {course.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <button
                                onClick={() => openModal(course.id)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                aria-label={`View students for ${course.title}`}
                                disabled={!course.assessment || studentResults.length === 0}
                              >
                                {course.assessment
                                  ? studentResults.length > 0
                                    ? `${studentResults.length} Student${studentResults.length > 1 ? 's' : ''}`
                                    : "No Students"
                                  : "No Assessment"}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() =>
                                  navigate(
                                    course.assessment
                                      ? `${ROUTES.INSTRUCTOR}${ROUTES.EDIT_ASSESSMENT}/${course.assessment.id}`
                                      : `${ROUTES.INSTRUCTOR}${ROUTES.CREATE_ASSESSMENT}`,
                                    { state: { courseId: course.id, courseTitle: course.title } }
                                  )
                                }
                                className={`inline-flex items-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${
                                  course.assessment
                                    ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 focus:ring-indigo-500"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600"
                                }`}
                                aria-label={
                                  course.assessment
                                    ? `Edit assessment for ${course.title}`
                                    : `Create assessment for ${course.title}`
                                }
                              >
                                {course.assessment ? (
                                  <>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {modalCourseId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-slide-in">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl transform transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Results: {courses.find((c) => c.id === modalCourseId)?.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {(() => {
                  const course = courses.find((c) => c.id === modalCourseId);
                  const studentResults = course?.assessment?.results || [];
                  if (!course?.assessment || studentResults.length === 0) {
                    return (
                      <p className="text-gray-500 text-center py-4 text-sm font-medium">
                        No student results available.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {studentResults.map((result, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <p className="text-sm text-gray-700 mb-1">
                            <strong className="font-semibold text-gray-900">Student:</strong> {result.studentName}
                          </p>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong className="font-semibold text-gray-900">Marks:</strong> {result.marks}
                          </p>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong className="font-semibold text-gray-900">Attempts:</strong> {result.attempts}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong className="font-semibold text-gray-900">Status:</strong>{" "}
                            <span
                              className={
                                result.attempts === 0
                                  ? "text-yellow-600 font-medium"
                                  : result.passed
                                  ? "text-green-600 font-medium"
                                  : result.passed === undefined
                                  ? "text-gray-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {result.attempts === 0
                                ? "Pending"
                                : result.passed
                                ? "Passed"
                                : result.passed === undefined
                                ? "Not Evaluated"
                                : "Failed"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ListAssessments;