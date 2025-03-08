import React, { useState } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import axios from "axios";
import { config, configMultiPart } from "../../configaration/Config";

const AddCourse_Pricing = () => {
    const [pricingOption, setPricingOption] = useState<'Free' | 'Premium' | ''>('');
    const [formData, setFormData] = useState({
        price: '',
        accountNumber: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };
    const { formData: contextData, resetFormData } = useCourseForm();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const completeData = {
          ...contextData,
          ...formData,
          isPaid: pricingOption,
        };
    
        try {
            console.log(completeData,"complete data is here");
            // let name = 'aswin'
            const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

        //   const response = await axios.post("/instructor/createCourse", completeData,configMultiPart);
        // const response = await axios.post(`${API_URL}/instructor/createCourse`, { name: "aswin" }, {
        //     headers: { 
        //         "Content-Type": "application/json" 
        //     },
        //     withCredentials: true,
        // });
        const response = await axios.post(`${API_URL}/instructor/createCourse`, completeData, configMultiPart);
        
        
          console.log(response);
          

          console.log("Course added:", response.data);
          resetFormData(); // Clear context data after successful submission
        } catch (error) {
          console.error("Error adding course:", error);
        }
      };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <InstructorSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
            <CourseProgress/>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    {/* Pricing Options */}
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl mb-4 font-semibold">Choose Pricing Plan</h2>
                        <div className="flex justify-center gap-4">
                            <label
                                className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                                    pricingOption === 'Free' ? 'border-violet-500' : 'border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="pricingOption"
                                    value="Free"
                                    className="hidden"
                                    onChange={() => setPricingOption('Free')}
                                />
                                Free
                            </label>
                            <label
                                className={`flex-1 p-2 border rounded-lg text-center cursor-pointer ${
                                    pricingOption === 'Premium' ? 'border-violet-500' : 'border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="pricingOption"
                                    value="Premium"
                                    className="hidden"
                                    onChange={() => setPricingOption('Premium')}
                                />
                                Premium
                            </label>
                        </div>
                    </div>

                    {/* Premium Fields */}
                    {pricingOption === 'Premium' && (
                        <div className="mb-6">
                            <h3 className="text-xl mb-4 font-semibold text-center">Premium Plan Details</h3>
                            <input
                                type="text"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email ID"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    )}

                    {/* Next Button */}
                    <button
                        type="submit"
                        className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                        Save & Publish  
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddCourse_Pricing;
