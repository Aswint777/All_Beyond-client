import React, { useState } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";

const AddCourse_Details = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState<"Free" | "Paid" | "">("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            <h1  className="text-2xl p-3 ">Course Details</h1>
          {/* Image Upload */}
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
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
          </label>

          {/* Course Title */}
          <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1"> Course Title</label>
          <input
            type="text"
            placeholder="Course Title"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Description */}
          <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Description"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            required
          ></textarea>

          {/* Category Dropdown */}
          <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Category</label>

          <select
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            defaultValue="Personal Finance"
          >
            <option value="Personal Finance">Personal Finance</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
          </select>

          <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1"> Instructor Name</label>
          <input
            type="text"
            placeholder="Instructor Name"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Additional Details */}
          <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1"> Instructor </label>
          <div className="flex mb-4">
            <textarea
              placeholder="Additional Details"
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
            ></textarea>
            {/* <input
              type="text"
              placeholder="Price"
              className="w-1/4 p-2 border border-gray-300 rounded-lg"
            /> */}
          </div>

          {/* Certificate Checkbox */}
          {/* <div className="flex items-center mb-4">
            <input type="checkbox" id="certificate" className="mr-2" />
            <label htmlFor="certificate">Certificate available</label>
          </div> */}

          {/* Pricing Options */}
          {/* <div className="flex justify-between mb-4">
            <label
              className={`flex-1 p-2 border rounded-lg mr-2 text-center cursor-pointer ${
                isPaid === "Free" ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="pricing"
                value="Free"
                className="hidden"
                onChange={() => setIsPaid("Free")}
              />
              Free
            </label>
            <label
              className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                isPaid === "Paid" ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="pricing"
                value="Paid"
                className="hidden"
                onChange={() => setIsPaid("Paid")}
              />
              Paid
            </label>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-red-700"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse_Details;
