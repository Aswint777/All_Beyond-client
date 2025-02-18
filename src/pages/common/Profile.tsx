import React, { useEffect, useState } from "react";
import dummyImage from "../../assets/images/blank-profile-picture-973460_640.webp";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import axios from "axios";
import { config } from "../../configaration/Config";

const Profile: React.FC = () => {
  const { userDetails } = useSelector((state: RootState) => state.user);
  
  const [profileImage, setProfileImage] = useState<string>(
    userDetails?.profilePhoto || dummyImage
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // ✅ Store selected image file


  const [formData, setFormData] = useState({
    userId :userDetails?.userId,
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",
    contactNumber: userDetails?.contactNumber,
    linkedin:userDetails?.linkedin|| "",
    facebook:userDetails?.facebook|| "",
    instagram: userDetails?.instagram||"",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  console.log(formData,"????????????");
  useEffect(() => {
    console.log("Profile updated:", userDetails);    
  }, [userDetails]);

  // ✅ Handle Text Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // ✅ Store file for upload
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  
  

  // ✅ Separate API Call for Profile Photo Upload
  const uploadProfilePhoto = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }
  
    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      const formData = new FormData();
  
      formData.append("profilePhoto", selectedFile); // ✅ Use selectedFile correctly
      formData.append("userId", userDetails?.userId || "");
  
      console.log("Uploading file:", selectedFile); // ✅ Debugging log
  
      const response = await axios.put(`${API_URL}/auth/uploadProfilePhoto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setProfileImage(response.data.profilePhoto); // ✅ Update UI
        alert("Profile photo updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo.");
    }
  };
  


  // ✅ Handle Form Submission
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
    console.log("Updated Profile Data:", formData);
    alert("Profile updated successfully!");
    const updateProfile = await axios.put(`${API_URL}/auth/updateProfile`,formData,config)
    if(updateProfile) alert('response is here success')
  };

  return (
    <>
      <UserNavbar />
      {/* <div className="min-h-screen flex"> */}
      <div className="min-h-screen bg-gray-100 flex">

        {/* Sidebar */}
        {/* <aside className="w-1/4 bg-gray-100 p-4"> */}
          <StudentSideBar />
        {/* </aside> */}

        {/* Main Content */}
        <main className="flex-1 bg-white p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-6">
            Edit Your Profile
          </h1>

          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* Personal Details */}
            {["firstName", "lastName", "email", "contactNumber"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  className="w-full border rounded p-2"
                  placeholder={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Password Changes */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2">Password Changes</h2>
            </div>

            {["currentPassword", "newPassword", "confirmPassword"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="password"
                    name={field}
                    className="w-full border rounded p-2"
                    placeholder={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                  />
                </div>
              )
            )}

            {/* Social Profile */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2">Social Profile</h2>
            </div>

            {["linkedin", "facebook", "instagram"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  className="w-full border rounded p-2"
                  placeholder={`Enter your ${field} username`}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="col-span-2 mt-6 flex justify-end gap-4">
              <button type="reset" className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </form>
        </main>

        {/* Profile Image Section */}
        <aside className="w-1/4 p-4 flex flex-col items-center">
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-full border border-gray-300 w-36 h-36 object-cover"
            />
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
            <button
            onClick={uploadProfilePhoto} // ✅ Upload Image Separately
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!selectedFile}
          >
            Update Photo
          </button>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            {formData.firstName}
          </p>
        </aside>
      </div>
    </>
  );
};

export default Profile;
