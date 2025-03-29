import React, { useEffect, useState } from "react";
import dummyImage from "../../assets/images/blank-profile-picture-973460_640.webp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import StudentSideBar from "../../components/layout/StudentSideBar";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import axios from "axios";
import { config } from "../../configaration/Config";
import { updateProfilePhoto } from "../../redux/reducer/UserDetailsSlice";

interface FormData {
  userId: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface UpdateProfilePayload {
  userId: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state: RootState) => state.user);

  const [profileImage, setProfileImage] = useState<string>(
    userDetails?.profilePhoto || dummyImage
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    userId: userDetails?.userId || "",
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    contactNumber: userDetails?.contactNumber || "",
    linkedin: userDetails?.linkedin || "",
    facebook: userDetails?.facebook || "",
    instagram: userDetails?.instagram || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        userId: userDetails.userId,
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        contactNumber: userDetails.contactNumber || "",
        linkedin: userDetails.linkedin || "",
        facebook: userDetails.facebook || "",
        instagram: userDetails.instagram || "",
      }));
      setProfileImage(userDetails.profilePhoto || dummyImage);
    }
  }, [userDetails]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number must be 10 digits";
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin))
      newErrors.linkedin = "Enter a valid LinkedIn URL";
    if (formData.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.*$/.test(formData.facebook))
      newErrors.facebook = "Enter a valid Facebook URL";
    if (formData.instagram && !/^https?:\/\/(www\.)?instagram\.com\/.*$/.test(formData.instagram))
      newErrors.instagram = "Enter a valid Instagram URL";

    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword)
        newErrors.currentPassword = "Current password is required";
      if (!formData.newPassword) newErrors.newPassword = "New password is required";
      else if (formData.newPassword.length < 6)
        newErrors.newPassword = "New password must be at least 6 characters";
      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

      const response = await axios.put(`${API_URL}/auth/uploadProfilePhoto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200) {
        setProfileImage(response.data.data.profilePhoto);
        dispatch(updateProfilePhoto(response.data.data.profilePhoto));
        setSuccess(true);
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
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
      const payload: UpdateProfilePayload = { ...formData };

      if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
        delete payload.currentPassword;
        delete payload.newPassword;
        delete payload.confirmPassword;
      }

      console.log("Payload sent to backend:", payload);

      const response = await axios.put(`${API_URL}/auth/updateProfile`, payload, config);

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex">
        {userDetails?.role === "student" ? <StudentSideBar /> : <InstructorSidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Your Profile</h1>

          {/* Success Notification */}
          {success && (
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
              <span className="font-semibold">Profile updated successfully!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <form
              className="flex-1 bg-white shadow-xl rounded-2xl p-6 space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["firstName", "lastName", "contactNumber"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field as keyof FormData]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder={`Enter your ${field}`}
                    />
                    {errors[field as keyof FormErrors] && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors[field as keyof FormErrors]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Password Changes */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Password Changes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="password"
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={
                          field === "currentPassword"
                            ? "Enter current password"
                            : "Enter new password"
                        }
                      />
                      {errors[field as keyof FormErrors] && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors[field as keyof FormErrors]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Profiles */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Profiles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {["linkedin", "facebook", "instagram"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Enter your ${field} URL`}
                      />
                      {errors[field as keyof FormErrors] && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors[field as keyof FormErrors]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="reset"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={loading}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Profile Photo Section */}
            <aside className="lg:w-1/4 bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
              <label htmlFor="profileImageInput" className="cursor-pointer">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-purple-200 object-cover shadow-md hover:opacity-80 transition-all duration-200"
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
                onClick={uploadProfilePhoto}
                className={`mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Update Photo"}
              </button>
            </aside>
          </div>
        </main>
      </div>
      </div>
    </>
  );
};

export default Profile;