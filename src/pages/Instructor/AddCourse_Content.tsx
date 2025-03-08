import React, { useEffect, useState } from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { useNavigate } from "react-router-dom";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";

type Lesson = {
  title: string;
  description: string;
  video: File | null;
};

type Module = {
  title: string;
  lessons: Lesson[];
};

const AddCourse_Content = () => {
    
    const [modules, setModules] = useState<Module[]>([]);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const { updateFormData,formData } = useCourseForm();
    const navigate = useNavigate();
    
  const addModule = () => {
    if (newModuleTitle.trim()) {
      setModules([...modules, { title: newModuleTitle, lessons: [] }]);
      setNewModuleTitle("");
    }
  };

  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | File | null
  ) => {
    const updatedModules = [...modules];
    const updatedLesson = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    updatedModules[moduleIndex].lessons[lessonIndex] = updatedLesson;
    setModules(updatedModules);
  };

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      title: "",
      description: "",
      video: null,
    });
    setModules(updatedModules);
  };
  const handleNext = () => {
    updateFormData({ modules });
    navigate("/instructor/AddCourse_Pricing");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Modules:", modules);
  };
  // Determine active stage based on current route
  useEffect(() => {
   if (formData?.modules) {
      setModules(formData.modules);
    }
  }, [formData]);



  return (
    <div className="flex">
      {/* Sidebar */}
      <InstructorSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <CourseProgress />

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl mb-4 font-semibold text-center">
            Modules and Lessons
          </h2>

          {/* Module Title Input */}
          <div className="mb-4">
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Module Title
            </label>
            <input
              type="text"
              placeholder="Module Title"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mr-2 mb-2"
            />
            <button
              type="button"
              onClick={addModule}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add Module
            </button>
          </div>

          {/* Display Modules and Lessons */}
          {modules.map((module, moduleIndex) => (
            <div
              key={moduleIndex}
              className="mb-6 border rounded-lg p-4 bg-gray-200 border-gray-600"
            >
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>

              {module.lessons.map((lesson, lessonIndex) => (
                <div className="mb-4 border rounded-lg p-4 bg-white">
                  <h4 className="text-lg font-semibold mb-2">
                    Lesson {lessonIndex + 1}
                  </h4>

                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(
                        moduleIndex,
                        lessonIndex,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                    required
                  />

                  <textarea
                    placeholder="Lesson Description"
                    value={lesson.description}
                    onChange={(e) =>
                      handleLessonChange(
                        moduleIndex,
                        lessonIndex,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                    required
                  ></textarea>

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload Video
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        if (file.size > 500 * 1024 * 1024) {
                          // 50MB size limit
                          alert(
                            "Video file is too large. Please upload a file smaller than 50MB."
                          );
                          return;
                        }
                        handleLessonChange(
                          moduleIndex,
                          lessonIndex,
                          "video",
                          file
                        );
                      }
                    }}
                    className="hidden"
                    id={`video-upload-${moduleIndex}-${lessonIndex}`}
                  />

                  <label
                    htmlFor={`video-upload-${moduleIndex}-${lessonIndex}`}
                    className="cursor-pointer inline-block mb-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {lesson.video ? "Replace Video" : "Upload Video"}
                  </label>

                  {lesson.video && (
                    <div className="mb-2">
                      <video
                        controls
                        className="w-full mb-2 rounded-lg"
                        src={URL.createObjectURL(lesson.video)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleLessonChange(
                            moduleIndex,
                            lessonIndex,
                            "video",
                            null
                          )
                        }
                        className="p-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        Remove Video
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addLesson(moduleIndex)}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Lesson
              </button>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-800 mt-4"
            onClick={handleNext }
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse_Content;
