import AddCourse_Content from "../pages/Instructor/AddCourse_Content"

export const ROUTES = {

  // Home routes
  HOME: "/",
  COURSES:'/courses',
  COURSE_DETAILS:"/courseDetails/:courseId",

  // AuThentication routes
  SIGNUP: "/SignUP",
  LOGIN: "/login",
  OTP_VERIFY: "/OtpVerify",

  // USER
  USER:'/user/',
  PROFILE: "profile",
  INSTRUCTOR_APPLY_PAGE: "InstructorApplyPage",
  INSTRUCTOR_APPLICATION_FORM: "InstructorApplicationForm",

  // ADMIN
  ADMIN:'/admin',
  ADMIN_INSTRUCTOR_APPLICATION_LIST: "/AdminInstructorApplicationList",
  CATEGORY_LIST: "/categoryListPage",
  ADD_CATEGORY: "/AddCategoryPage",
  EDIT_CATEGORY: "/EditCategory",
  ADMIN_STUDENT_LIST: "/AdminStudentsListPage",
  ADMIN_INSTRUCTOR_LIST: "/AdminInstructorListPage",
  ADMIN_USER_DETAILS:"/user_details/",


  // INSTRUCTOR
  INSTRUCTOR:'/instructor',
  INSTRUCTOR_COURSE:"/courses",
  ADD_COURSE_DETAILS:"/AddCourse_Details",
  ADD_COURSE_CONTENT:"/AddCourse_Content" ,
  ADD_COURSE_PRICING:"/AddCourse_Pricing",
  EDIT_COURSE :"/edit-course/",

  // STUDENT ROUTES
  STUDENT:"/student",
  STUDENT_COURSES:'/my-courses',
};
