import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { useNavigate } from "react-router-dom";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import axios from "axios";

interface FormValues {
  title: string;
  courseDescription: string;
  category: string;
  instructorName: string;
  aboutInstructor: string;
  thumbnail: File | null;
}

const AddCourse_Details: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  ); // Use URL string for preview
  const { updateFormData, formData } = useCourseForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await axios.get(
          `${API_URL}/instructor/courseCategories`
        );
        const categoryNames = response.data.data.map(
          (category: any) => category.name
        );
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.thumbnail) {
      const url = URL.createObjectURL(formData.thumbnail);
      setThumbnailPreviewUrl(url);
      console.log("Initial thumbnail URL from context:", url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.thumbnail]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Course title is required"),
    courseDescription: Yup.string().required("Description is required"),
    category: Yup.string().required("Please select a category"),
    instructorName: Yup.string().required("Instructor name is required"),
    aboutInstructor: Yup.string(),
    thumbnail: Yup.mixed().required("Thumbnail is required"),
  });

  const initialValues: FormValues = {
    title: formData.title || "",
    courseDescription: formData.courseDescription || "",
    category: formData.category || "",
    instructorName: formData.instructorName || "",
    aboutInstructor: formData.aboutInstructor || "",
    thumbnail: formData.thumbnail || null,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />
      <div className="flex-1 p-6">
        <CourseProgress />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Submitting values:", values);
            updateFormData(values);
            navigate("/instructor/AddCourse_Content");
          }}
        >
          {({ setFieldValue }) => (
            <Form className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl p-3">Course Details</h1>

              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 mb-4 cursor-pointer"
              >
                {thumbnailPreviewUrl ? (
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Selected Thumbnail"
                    className="h-full w-full object-cover rounded-lg"
                    onError={() =>
                      console.error("Thumbnail image failed to load")
                    }
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    <span className="text-3xl">📷</span>
                    <p>Upload Thumbnail</p>
                  </div>
                )}
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0] || null;
                    if (file) {
                      console.log("Selected file:", file);
                      const url = URL.createObjectURL(file);
                      setThumbnailPreviewUrl(url);
                      setFieldValue("thumbnail", file);
                      updateFormData({ thumbnail: file });
                      console.log("Generated thumbnail URL:", url);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-red-500"
              />

              <Field
                type="text"
                name="title"
                placeholder="Course Title"
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("title", e.target.value);
                  updateFormData({ title: e.target.value });
                }}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500"
              />

              <Field
                as="textarea"
                name="courseDescription"
                placeholder="Description"
                className="w-full h-32 mb-4 p-2 border border-gray-300 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setFieldValue("courseDescription", e.target.value);
                  updateFormData({ courseDescription: e.target.value });
                }}
              />
              <ErrorMessage
                name="courseDescription"
                component="div"
                className="text-red-500"
              />

              <Field
                as="select"
                name="category"
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue("category", e.target.value);
                  updateFormData({ category: e.target.value });
                }}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                )}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500"
              />

              <Field
                type="text"
                name="instructorName"
                placeholder="Instructor Name"
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("instructorName", e.target.value);
                  updateFormData({ instructorName: e.target.value });
                }}
              />
              <ErrorMessage
                name="instructorName"
                component="div"
                className="text-red-500"
              />

              <Field
                as="textarea"
                name="aboutInstructor"
                placeholder="Additional Details"
                className="w-full h-32 mb-4 p-2 border border-gray-300 rounded-lg"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setFieldValue("aboutInstructor", e.target.value);
                  updateFormData({ aboutInstructor: e.target.value });
                }}
              />
              <ErrorMessage
                name="aboutInstructor"
                component="div"
                className="text-red-500"
              />

              <button
                type="submit"
                className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-800"
              >
                Next
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCourse_Details;
