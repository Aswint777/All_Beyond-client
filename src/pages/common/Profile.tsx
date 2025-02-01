import React, { useEffect, useState } from "react";
import dummyImage from "../../assets/images/blank-profile-picture-973460_640.webp";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // const { userDetails } = useSelector((state: RootState) => state.login);
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("Profile updated:", userDetails);
  }, [userDetails]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <>
      <div>
        <UserNavbar />
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-1/4 bg-gray-100 p-4">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-purple-600 font-semibold">
                Overview
              </a>
              <a href="#" className="text-gray-600">
                My Courses
              </a>
              <a href="#" className="text-gray-600">
                Analytics
              </a>
              <a href="#" className="text-gray-600">
                Assessments
              </a>
              <a href="#" className="text-gray-600">
                Messages
              </a>
              <a href="#" className="text-gray-600">
                Settings
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-6">
              Edit Your Profile
            </h1>

            <form className="grid grid-cols-2 gap-6">
              {/* Personal Details */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="First Name"
                  value={userDetails?.firstName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Last Name"
                  value={userDetails?.lastName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded p-2"
                  placeholder="Email"
                  value={userDetails?.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="Number"
                  className="w-full border rounded p-2"
                  placeholder="Phone"
                />
              </div>

              {/* Password Changes */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold mb-2">Password Changes</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded p-2"
                  placeholder="Current Password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded p-2"
                  placeholder="New Password"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded p-2"
                  placeholder="Confirm New Password"
                />
              </div>

              {/* Social Profile */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold mb-2">Social Profile</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="Username"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </main>

          {/* Profile Image Section */}
          <aside className="w-1/4 p-4 flex flex-col items-center">
            <label htmlFor="profileImageInput" className="cursor-pointer">
              <img
                src={profileImage || dummyImage} // Display uploaded image or fallback to dummy image
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
            <p className="mt-2 text-lg font-semibold text-gray-700">
              {userDetails?.username}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Profile;
