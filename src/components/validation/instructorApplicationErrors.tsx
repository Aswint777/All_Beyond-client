export interface InstructorApplicationErrors {
  [key: string]: string; // ✅ Allows dynamic key access
}

export const validateInstructorApplication = (formData: any): InstructorApplicationErrors => {
  let errors: InstructorApplicationErrors = {};

  if (!formData.firstName.trim()) errors.firstName = "First Name is required.";
  if (!formData.lastName.trim()) errors.lastName = "Last Name is required.";
  if (!formData.age || parseInt(formData.age) < 18) errors.age = "Must be at least 18 years old.";
  if (!formData.qualification.trim()) errors.qualification = "Qualification is required.";
  if (!formData.address.trim()) errors.address = "Address is required.";
  if (!formData.city.trim()) errors.city = "City is required.";
  if (!formData.country.trim()) errors.country = "Country is required.";
  if (!formData.pinNumber.trim()) errors.pinNumber = "Pin number is required.";

  // validate name
  if (formData.firstName.length < 3){
    errors.firstName ="name is too short"
  }
  if (formData.firstName.length > 15){
    errors.firstName ="name is too long"
  }
  if (formData.address.length > 15){
    errors.lastName ="name is too long"
  }

  if (formData.address.length > 30){
    errors.address ="Address is too long"
  }
  if (formData.city.length > 15){
    errors.city ="try a valid city"
  }

  // Validate Email
  if (!formData.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email format.";
  }

  // Validate Contact Number
  if (!formData.contactNumber) {
    errors.contactNumber = "Contact number is required.";
  } else if (!/^\d{10}$/.test(formData.contactNumber)) {
    errors.contactNumber = "Invalid phone number.";
  }

  // Validate Gender
  if (!formData.gender) {
    errors.gender = "Gender selection is required.";
  }

  // Validate File Uploads
  if (!formData.profilePhoto) errors.profilePhoto = "Profile photo is required.";
  if (!formData.educationFile) errors.educationFile = "Education file is required.";

  return errors;
};
