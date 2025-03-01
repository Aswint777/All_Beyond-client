import React, { useEffect, useState } from "react";
import dummyImage from "../../assets/images/blank-profile-picture-973460_640.webp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import axios from "axios";
import { config } from "../../configaration/Config";
import { updateProfilePhoto } from "../../redux/reducer/UserDetailsSlice";

const Profile: React.FC = () => {
  const dispatch = useDispatch(); // Initialize Redux dispatch

  const { userDetails } = useSelector((state: RootState) => state.user);
  
  const [profileImage, setProfileImage] = useState<string>(
    userDetails?.profilePhoto || dummyImage
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    userId: userDetails?.userId,
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",
    contactNumber: userDetails?.contactNumber,
    linkedin: userDetails?.linkedin || "",
    facebook: userDetails?.facebook || "",
    instagram: userDetails?.instagram || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    console.log("Profile updated:", userDetails);
  }, [userDetails]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 1000); // Hide success message after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);
      formData.append("userId", userDetails?.userId || "");

      const response = await axios.put(
        `${API_URL}/auth/uploadProfilePhoto`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
console.log(response);

      if (response.status === 200) {
        setProfileImage(response.data.data.profilePhoto);

        dispatch(updateProfilePhoto(response.data.data.profilePhoto));

        // alert("Profile photo updated successfully!");
        setSuccess(true)
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      console.log("Updated Profile Data:", formData);
      
      const updateProfile = await axios.put(
        `${API_URL}/auth/updateProfile`,
        formData,
        config
      );

      if (updateProfile.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        userId: userDetails.userId,
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        email: userDetails.email || "",
        contactNumber: userDetails.contactNumber,
        linkedin: userDetails.linkedin || "",
        facebook: userDetails.facebook || "",
        instagram: userDetails.instagram || "",
      }));
    }
  }, [userDetails]);
  

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-100 flex">
      {success && (
          <div className="fixed top-20 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            🎉 Application submitted successfully!
          </div>
        )}
        <StudentSideBar />
        <main className="flex-1 bg-white p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Edit Your Profile</h1>

          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
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

            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2">Password Changes</h2>
            </div>

            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
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
            ))}

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

            <div className="col-span-2 mt-6 flex justify-end gap-4">
              <button
                type="reset"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-green-500 text-white"}`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </main>

        <aside className="w-1/4 p-4 flex flex-col items-center">
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <img src={profileImage} alt="Profile" className="rounded-full border border-gray-300 w-36 h-36 object-cover" />
          </label>
          <input type="file" id="profileImageInput" accept="image/*" className="hidden" onChange={handleImageChange} />
          <button onClick={uploadProfilePhoto} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Uploading..." : "Update Photo"}
          </button>
        </aside>
      </div>

      {/* {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-green-500 text-lg font-semibold">Profile updated successfully!</p>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Profile;
