import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../configaration/Config";

interface Lesson {
  id: string;
  title: string; // Changed from lessonTitle
  description: string; // Changed from lessonDescription
  video: File | null | string;
}

interface Module {
  id: string;
  title: string; // Changed from moduleTitle
  lessons: Lesson[];
}

interface CourseFormData {
  title: string; // Changed from courseTitle
  courseDescription: string;
  category: string; // Changed from categoryName
  aboutInstructor: string;
  isPaid: "Free" | "Premium" | ""; // Changed from pricingOption
  price?: number | string;
  accountNumber?: number | string;
  email?: string; // Changed from additionalEmail
  phone?: number | string; // Changed from additionalContactNumber
  thumbnail?: File | null | string;
  modules: Module[]; // Changed from content
  instructor?: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Course title is required"),
  courseDescription: Yup.string().required("Description is required"),
  category: Yup.string().required("Please select a category"),
  aboutInstructor: Yup.string(),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
  modules: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Module title is required"),
        lessons: Yup.array().of(
          Yup.object().shape({
            title: Yup.string().required("Lesson title is required"),
            description: Yup.string().required("Lesson description is required"),
            video: Yup.mixed().required("A video file or URL is required"),
          })
        ),
      })
    )
    .min(1, "At least one module is required"),
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

const EditCourse = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<CourseFormData>({
    title: "",
    courseDescription: "",
    category: "",
    aboutInstructor: "",
    isPaid: "",
    price: "",
    accountNumber: "",
    email: "",
    phone: "",
    thumbnail: null,
    modules: [],
    instructor: "",
  });

  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await axios.get(`${API_URL}/instructor/courseCategories`, {
          withCredentials: true,
        });
        const categoryNames = response.data.data.map((category: any) => category.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    const fetchCourseData = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await axios.get(`${API_URL}/instructor/viewCourses/${courseId}`, config);
        const course = response.data.data;
        console.log("Fetched course data:", course);

        const categoryResponse = await axios.get(`${API_URL}/instructor/courseCategories`, {
          withCredentials: true,
        });
        const categoryMap = new Map(categoryResponse.data.data.map((cat: any) => [cat._id, cat.name]));
        const category = categoryMap.get(course.categoryName) || course.categoryName;

        const courseData: CourseFormData = {
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
          modules: course.content?.map((mod: any) => ({
            id: mod._id || uuidv4(),
            title: mod.moduleTitle || "",
            lessons: mod.lessons?.map((lesson: any) => ({
              id: lesson._id || uuidv4(),
              title: lesson.lessonTitle || "",
              description: lesson.lessonDescription || "",
              video: lesson.video || null,
            })) || [],
          })) || [],
        };
        setInitialFormData(courseData);
        if (course.thumbnailUrl) setThumbnailPreviewUrl(course.thumbnailUrl);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCategories();
    fetchCourseData();
  }, [courseId]);

  const handleSubmit = async (
    values: CourseFormData,
    { setSubmitting }: FormikHelpers<CourseFormData>
  ) => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    const data = new FormData();
    console.log("courseId:", courseId);

    data.append("title", values.title);
    data.append("courseDescription", values.courseDescription);
    data.append("category", values.category);
    data.append("instructor", values.instructor || "");
    data.append("aboutInstructor", values.aboutInstructor);
    data.append("isPaid", values.isPaid);

    if (values.isPaid === "Premium") {
      data.append("price", values.price?.toString() || "");
      data.append("accountNumber", values.accountNumber?.toString() || "");
      data.append("email", values.email || "");
      data.append("phone", values.phone?.toString() || "");
    }

    if (values.thumbnail instanceof File) {
      data.append("thumbnail", values.thumbnail);
    }

    values.modules.forEach((module, moduleIndex) => {
      data.append(`modules[${moduleIndex}][title]`, module.title);
      module.lessons.forEach((lesson, lessonIndex) => {
        data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][title]`, lesson.title);
        data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][lessonDescription]`, lesson.description);
        if (lesson.video instanceof File) {
          data.append(`video_${moduleIndex}_${lessonIndex}`, lesson.video);
        } else if (typeof lesson.video === "string") {
          data.append(`modules[${moduleIndex}][lessons][${lessonIndex}][video]`, lesson.video);
        }
      });
    });

    try {
      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.put(`${API_URL}/instructor/editCourse/${courseId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("Course updated successfully:", response.data);
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // The JSX remains mostly the same, just update field names
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <InstructorSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Edit Your Course</h1>
          <Formik
            initialValues={initialFormData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-10">
                <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Course Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="thumbnail-upload" className="block text-sm font-medium text-gray-600 mb-2">
                        Course Thumbnail
                      </label>
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-64 cursor-pointer bg-gray-100 hover:border-indigo-500 transition-colors duration-200"
                      >
                        {thumbnailPreviewUrl ? (
                          <img src={thumbnailPreviewUrl} alt="Thumbnail" className="h-full w-full object-cover rounded-xl" />
                        ) : (
                          <div className="text-gray-500 text-center p-4">
                            <span className="text-4xl">📸</span>
                            <p className="mt-2 text-sm">Drop or click to upload a thumbnail</p>
                          </div>
                        )}
                        <input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0] || null;
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setThumbnailPreviewUrl(url);
                              setFieldValue("thumbnail", file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Field
                          type="text"
                          name="title"
                          placeholder="Course Title"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Field
                          as="textarea"
                          name="courseDescription"
                          placeholder="Course Description"
                          className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                        <ErrorMessage name="courseDescription" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Field
                          as="select"
                          name="category"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        >
                          <option value="" disabled>Select a Category</option>
                          {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <Field
                          type="text"
                          name="instructor"
                          placeholder="Instructor Name"
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          disabled
                        />
                        <ErrorMessage name="instructor" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Field
                          as="textarea"
                          name="aboutInstructor"
                          placeholder="About the Instructor"
                          className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                        <ErrorMessage name="aboutInstructor" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Course Content</h2>
                  <FieldArray name="modules">
                    {({ push, remove }) => (
                      <div className="space-y-6">
                        {values.modules.map((module, moduleIndex) => (
                          <div
                            key={module.id}
                            className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <Field
                                name={`modules[${moduleIndex}].title`}
                                placeholder="Module Title"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => remove(moduleIndex)}
                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                              >
                                Delete Module
                              </button>
                            </div>
                            <ErrorMessage
                              name={`modules[${moduleIndex}].title`}
                              component="div"
                              className="text-red-500 text-sm mb-4"
                            />

                            <FieldArray name={`modules[${moduleIndex}].lessons`}>
                              {({ push: pushLesson, remove: removeLesson }) => (
                                <div className="space-y-6">
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson.id}
                                      className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between mb-4">
                                        <Field
                                          name={`modules[${moduleIndex}].lessons[${lessonIndex}].title`}
                                          placeholder="Lesson Title"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeLesson(lessonIndex)}
                                          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                        >
                                          Delete Lesson
                                        </button>
                                      </div>
                                      <ErrorMessage
                                        name={`modules[${moduleIndex}].lessons[${lessonIndex}].title`}
                                        component="div"
                                        className="text-red-500 text-sm mb-2"
                                      />

                                      <Field
                                        as="textarea"
                                        name={`modules[${moduleIndex}].lessons[${lessonIndex}].description`}
                                        placeholder="Lesson Description"
                                        className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 mb-4"
                                      />
                                      <ErrorMessage
                                        name={`modules[${moduleIndex}].lessons[${lessonIndex}].description`}
                                        component="div"
                                        className="text-red-500 text-sm mb-2"
                                      />

                                      <label className="block">
                                        <span className="text-sm font-medium text-gray-600 mb-2 block">Lesson Video</span>
                                        <input
                                          type="file"
                                          accept="video/*"
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0] || null;
                                            if (file)
                                              setFieldValue(`modules[${moduleIndex}].lessons[${lessonIndex}].video`, file);
                                          }}
                                          className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-200"
                                        />
                                      </label>
                                      {lesson.video &&
                                        (typeof lesson.video === "string" ? (
                                          <video src={lesson.video} controls className="mt-4 w-full rounded-lg shadow-sm" />
                                        ) : (
                                          <video
                                            src={URL.createObjectURL(lesson.video)}
                                            controls
                                            className="mt-4 w-full rounded-lg shadow-sm"
                                          />
                                        ))}
                                      <ErrorMessage
                                        name={`modules[${moduleIndex}].lessons[${lessonIndex}].video`}
                                        component="div"
                                        className="text-red-500 text-sm mt-2"
                                      />
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      pushLesson({
                                        id: uuidv4(),
                                        title: "",
                                        description: "",
                                        video: null,
                                      })
                                    }
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                  >
                                    + Add Lesson
                                  </button>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ id: uuidv4(), title: "", lessons: [] })}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          + Add Module
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Pricing</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <label
                        className={`flex-1 p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 ${
                          values.isPaid === "Free" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-300 hover:border-indigo-300"
                        }`}
                      >
                        <Field
                          type="radio"
                          name="isPaid"
                          value="Free"
                          className="hidden"
                          onClick={() => setFieldValue("isPaid", "Free")}
                        />
                        Free
                      </label>
                      <label
                        className={`flex-1 p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 ${
                          values.isPaid === "Premium" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-300 hover:border-indigo-300"
                        }`}
                      >
                        <Field
                          type="radio"
                          name="isPaid"
                          value="Premium"
                          className="hidden"
                          onClick={() => setFieldValue("isPaid", "Premium")}
                        />
                        Premium
                      </label>
                    </div>
                    <ErrorMessage name="isPaid" component="div" className="text-red-500 text-sm" />

                    {values.isPaid === "Premium" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Field
                            type="text"
                            name="price"
                            placeholder="Price"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                          <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="accountNumber"
                            placeholder="Account Number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                          <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <Field
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;