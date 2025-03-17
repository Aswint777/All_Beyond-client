import React, { useEffect, useState } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { useNavigate } from "react-router-dom";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import axios from "axios";
// import { useCourseForm } from "../../context/CourseFormContext";

const AddCourse_Details = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState<"Free" | "Paid" | "">("");
  const [title, setTitle] = useState("");
  const [courseDescription, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [instructorName, setInstructorName] = useState("");
  const [aboutInstructor, setAboutInstructor] = useState("");

  const { updateFormData, formData } = useCourseForm();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleNext = () => {
    updateFormData({
      title,
      courseDescription,
      category,
      instructorName,
      aboutInstructor,
      thumbnail: selectedImage,
      // isPaid,
    });
    navigate("/instructor/AddCourse_Content");
  };
  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

        const response = await axios.get(
          `${API_URL}/instructor/courseCategories`
        );

        console.log("API Response:", response.data.data); // Debugging log
        const categoryNames = response.data.data.map(
          (category: any) => category.name
        );

        setCategories(categoryNames); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Fallback to an empty array to prevent errors
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    if (formData) {
      setTitle(formData.title || "");
      setDescription(formData.courseDescription || "");
      setCategory(formData.category || "");
      setInstructorName(formData.instructorName || "");
      setAboutInstructor(formData.aboutInstructor || "");
      // setIsPaid(formData.isPaid || "");
      setSelectedImage(formData.thumbnail || null);
    }
  }, [formData]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />

      <div className="flex-1 p-6">
        <CourseProgress />

        <form className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl p-3">Course Details</h1>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 mb-4 cursor-pointer">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500 text-center">
                <span className="text-3xl">📷</span>
                <p>Upload Thumbnail</p>
              </div>
            )}
            <input
              type="file"
              // name="thumbnail"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Course Title"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            value={courseDescription}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <select
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          </select>

          <input
            type="text"
            placeholder="Instructor Name"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            required
          />

          <textarea
            placeholder="Additional Details"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            value={aboutInstructor}
            onChange={(e) => setAboutInstructor(e.target.value)}
          ></textarea>

          <button
            type="button"
            className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-800"
            onClick={handleNext}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse_Details;
