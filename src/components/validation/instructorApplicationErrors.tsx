export interface InstructorApplicationErrors {
  [key: string]: string; 
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

  if (formData.firstName.length < 3){
    errors.firstName ="name is too short"
  }
  if (formData.firstName.length > 15){
    errors.firstName ="name is too long"
  }

  if (formData.address.length > 50){
    errors.address ="Address is too long"
  }
  if (formData.city.length > 15){
    errors.city ="try a valid city"
  }

  if (!formData.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email format.";
  }

  if (!formData.contactNumber) {
    errors.contactNumber = "Contact number is required.";
  } else if (!/^\d{10}$/.test(formData.contactNumber)) {
    errors.contactNumber = "Invalid phone number.";
  }

  if (!formData.gender) {
    errors.gender = "Gender selection is required.";
  }

  if (!formData.profilePhoto) errors.profilePhoto = "Profile photo is required.";
  if (!formData.educationFile) errors.educationFile = "Education file is required.";

  return errors;
};
