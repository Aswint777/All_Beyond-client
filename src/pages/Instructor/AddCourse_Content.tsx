import React, { useState } from 'react'



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
    const [newModuleTitle, setNewModuleTitle] = useState('');
  
    // Handle adding a new module
    const addModule = () => {
      if (newModuleTitle.trim()) {
        setModules([
          ...modules,
          { title: newModuleTitle, lessons: [] }
        ]);
        setNewModuleTitle('');
      }
    };
  
    // Handle lesson change
    const handleLessonChange = (
      moduleIndex: number,
      lessonIndex: number,
      field: keyof Lesson,
      value: string | File | null
    ) => {
      const updatedModules = [...modules];
      const updatedLesson = { ...updatedModules[moduleIndex].lessons[lessonIndex], [field]: value };
      updatedModules[moduleIndex].lessons[lessonIndex] = updatedLesson;
      setModules(updatedModules);
    };
  
    // Add a new lesson to a module
    const addLesson = (moduleIndex: number) => {
      const updatedModules = [...modules];
      updatedModules[moduleIndex].lessons.push({
        title: '',
        description: '',
        video: null,
      });
      setModules(updatedModules);
    };
  
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Modules:', modules);
      // Handle submission logic here
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 font-semibold text-center">Add Modules and Lessons</h2>
  
        {/* Module Title Input */}
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="Module Title"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
          />
          <button
            type="button"
            onClick={addModule}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Module
          </button>
        </div>
  
        {/* Display Modules and Lessons */}
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
  
            {module.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="mb-4 border rounded-lg p-4 bg-white">
                <h4 className="text-lg font-semibold mb-2">Lesson {lessonIndex + 1}</h4>
  
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)
                  }
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                  required
                />
  
                <textarea
                  placeholder="Lesson Description"
                  value={lesson.description}
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, 'description', e.target.value)
                  }
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                  required
                ></textarea>
  
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, 'video', e.target.files?.[0] || null)
                  }
                  className="mb-2"
                  required
                />
  
                {lesson.video && (
                  <video
                    controls
                    className="w-full mb-2 rounded-lg"
                    src={URL.createObjectURL(lesson.video)}
                  />
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
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-4"
        >
          Submit
        </button>
      </form>
    );
}

export default AddCourse_Content
