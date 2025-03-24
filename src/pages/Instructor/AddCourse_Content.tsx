import React from "react";
import InstructorSidebar from "../../components/layout/InstructorSidebar";
import { useNavigate } from "react-router-dom";
import CourseProgress from "../../components/reusableComponents/CourseProgress";
import { useCourseForm } from "../../components/context/CourseFormContext";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, FieldArray, FormikHelpers } from "formik";
import * as Yup from "yup";

type Lesson = {
  id: string;
  title: string;
  lessonDescription: string;
  video: File | null;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type FormValues = {
  modules: Module[];
  newModuleTitle: string;
};

// Define custom error types for nested structure
interface LessonErrors {
  title?: string;
  lessonDescription?: string;
  video?: string;
}

interface ModuleErrors {
  title?: string;
  lessons?: LessonErrors[];
}

const validationSchema = Yup.object().shape({
  modules: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Module title is required"),
      lessons: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Lesson title is required"),
          lessonDescription: Yup.string().required(
            "Lesson description is required"
          ),
          video: Yup.mixed<File>()
            .required("A video file is required")
            .test(
              "fileSize",
              "Video file is too large. Please upload a file smaller than 50MB.",
              (value) => !value || (value && value.size <= 50 * 1024 * 1024) // 50MB in bytes
            ),
        })
      ),
    })
  ),
});

const AddCourse_Content: React.FC = () => {
  const { updateFormData, formData } = useCourseForm();
  const navigate = useNavigate();

  const initialValues: FormValues = {
    modules: formData?.modules
      ? (formData.modules as Module[]).map((mod) => ({
          ...mod,
          id: mod.id || uuidv4(),
          lessons: mod.lessons.map((lesson) => ({
            ...lesson,
            id: lesson.id || uuidv4(),
          })),
        }))
      : [],
    newModuleTitle: "",
  };

  const handleNext = (values: FormValues) => {
    updateFormData({ modules: values.modules });
    navigate("/instructor/AddCourse_Pricing");
  };

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log("Modules:", values.modules);
    handleNext(values);
    setSubmitting(false);
  };

  return (
    <div className="flex">
      <InstructorSidebar />
      <div className="flex-1 p-6">
        <CourseProgress />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl mb-4 font-semibold mb-6 text-center">
                Modules and Lessons
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Title
                </label>
                <Field
                  type="text"
                  name="newModuleTitle"
                  placeholder="Module Title"
                  className="w-full p-2 border border-gray-300 rounded-lg mr-2 mb-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (values.newModuleTitle.trim()) {
                      setFieldValue("modules", [
                        ...values.modules,
                        {
                          id: uuidv4(),
                          title: values.newModuleTitle,
                          lessons: [],
                        },
                      ]);
                      setFieldValue("newModuleTitle", "");
                    }
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Module
                </button>
              </div>

              <FieldArray name="modules">
                {({ remove }) => (
                  <>
                    {values.modules.map((module, moduleIndex) => (
                      <div
                        key={module.id}
                        className="mb-6 border rounded-lg p-4 bg-gray-200 border-gray-600"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold mb-2">
                            {module.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => remove(moduleIndex)}
                            className="p-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                          >
                            Delete Module
                          </button>
                        </div>

                        <FieldArray name={`modules[${moduleIndex}].lessons`}>
                          {({ push, remove: removeLesson }) => (
                            <>
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="mb-4 border rounded-lg p-4 bg-white"
                                >
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-semibold mb-2">
                                      Lesson {lessonIndex + 1}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => removeLesson(lessonIndex)}
                                      className="p-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                    >
                                      Delete Lesson
                                    </button>
                                  </div>

                                  <Field
                                    name={`modules[${moduleIndex}].lessons[${lessonIndex}].title`}
                                    placeholder="Lesson Title"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                                  />
                                  {errors.modules?.[moduleIndex] &&
                                    touched.modules?.[moduleIndex]?.lessons?.[
                                      lessonIndex
                                    ]?.title && (
                                      <div className="text-red-500 text-sm">
                                        {typeof errors.modules[moduleIndex] ===
                                          "object" &&
                                          (
                                            errors.modules[
                                              moduleIndex
                                            ] as ModuleErrors
                                          ).lessons?.[lessonIndex]?.title}
                                      </div>
                                    )}

                                  <Field
                                    as="textarea"
                                    name={`modules[${moduleIndex}].lessons[${lessonIndex}].lessonDescription`}
                                    placeholder="Lesson Description"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                                  />
                                  {errors.modules?.[moduleIndex] &&
                                    touched.modules?.[moduleIndex]?.lessons?.[
                                      lessonIndex
                                    ]?.lessonDescription && (
                                      <div className="text-red-500 text-sm">
                                        {typeof errors.modules[moduleIndex] ===
                                          "object" &&
                                          (
                                            errors.modules[
                                              moduleIndex
                                            ] as ModuleErrors
                                          ).lessons?.[lessonIndex]
                                            ?.lessonDescription}
                                      </div>
                                    )}

                                  <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Upload Video
                                  </label>
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      const file = e.target.files?.[0] || null;
                                      if (
                                        file &&
                                        file.size > 50 * 1024 * 1024
                                      ) {
                                        alert(
                                          "Video file is too large. Please upload a file smaller than 50MB."
                                        );
                                        return;
                                      }
                                      setFieldValue(
                                        `modules[${moduleIndex}].lessons[${lessonIndex}].video`,
                                        file
                                      );
                                    }}
                                    className="hidden"
                                    id={`video-upload-${module.id}-${lesson.id}`}
                                  />
                                  <label
                                    htmlFor={`video-upload-${module.id}-${lesson.id}`}
                                    className="cursor-pointer inline-block mb-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    {lesson.video
                                      ? "Replace Video"
                                      : "Upload Video"}
                                  </label>
                                  {errors.modules?.[moduleIndex] &&
                                    touched.modules?.[moduleIndex]?.lessons?.[
                                      lessonIndex
                                    ]?.video && (
                                      <div className="text-red-500 text-sm">
                                        {typeof errors.modules[moduleIndex] ===
                                          "object" &&
                                          (
                                            errors.modules[
                                              moduleIndex
                                            ] as ModuleErrors
                                          ).lessons?.[lessonIndex]?.video}
                                      </div>
                                    )}

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
                                          setFieldValue(
                                            `modules[${moduleIndex}].lessons[${lessonIndex}].video`,
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
                                onClick={() =>
                                  push({
                                    id: uuidv4(),
                                    title: "",
                                    lessonDescription: "",
                                    video: null,
                                  })
                                }
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                Add Lesson
                              </button>
                            </>
                          )}
                        </FieldArray>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-800 mt-4"
              >
                Next
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCourse_Content;

// import React, { useEffect, useState } from "react";
// import InstructorSidebar from "../../components/layout/InstructorSidebar";
// import { useNavigate } from "react-router-dom";
// import CourseProgress from "../../components/reusableComponents/CourseProgress";
// import { useCourseForm } from "../../components/context/CourseFormContext";
// import { v4 as uuidv4 } from "uuid";

// type Lesson = {
//   id: string;
//   title: string;
//   lessonDescription: string;
//   video: File | null;
// };

// type Module = {
//   id: string;
//   title: string;
//   lessons: Lesson[];
// };

// const AddCourse_Content = () => {
//   const [modules, setModules] = useState<Module[]>([]);
//   const [newModuleTitle, setNewModuleTitle] = useState("");
//   const { updateFormData, formData } = useCourseForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (formData?.modules) {
//       // Explicitly cast formData.modules as Module[]
//       const formattedModules: Module[] = (formData.modules as Module[]).map((mod) => ({
//         ...mod,
//         id: mod.id || uuidv4(), // Ensure each module has an id
//         lessons: mod.lessons.map((lesson) => ({
//           ...lesson,
//           id: lesson.id || uuidv4(), // Ensure each lesson has an id
//         })),
//       }));

//       setModules(formattedModules);
//     }
//   }, [formData]);

//   const addModule = () => {
//     if (newModuleTitle.trim()) {
//       setModules((prevModules) => [
//         ...prevModules,
//         { id: uuidv4(), title: newModuleTitle, lessons: [] },
//       ]);
//       setNewModuleTitle("");
//     }
//   };

//   const handleLessonChange = (
//     moduleIndex: number,
//     lessonIndex: number,
//     field: keyof Lesson,
//     value: string | File | null
//   ) => {
//     setModules((prevModules) =>
//       prevModules.map((module, idx) =>
//         idx === moduleIndex
//           ? {
//               ...module,
//               lessons: module.lessons.map((lesson, lIdx) =>
//                 lIdx === lessonIndex ? { ...lesson, [field]: value } : lesson
//               ),
//             }
//           : module
//       )
//     );
//   };

//   const addLesson = (moduleIndex: number) => {
//     setModules((prevModules) =>
//       prevModules.map((module, idx) =>
//         idx === moduleIndex
//           ? {
//               ...module,
//               lessons: [
//                 ...module.lessons,
//                 { id: uuidv4(), title: "", lessonDescription: "", video: null },
//               ],
//             }
//           : module
//       )
//     );
//   };

//   const handleNext = () => {
//     updateFormData({ modules });
//     navigate("/instructor/AddCourse_Pricing");
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Modules:", modules);
//   };

//   return (
//     <div className="flex">
//       <InstructorSidebar />

//       <div className="flex-1 p-6">
//         <CourseProgress />

//         <form
//           onSubmit={handleSubmit}
//           className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md"
//         >
//           <h2 className="text-2xl mb-4 font-semibold text-center">
//             Modules and Lessons
//           </h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Module Title
//             </label>
//             <input
//               type="text"
//               placeholder="Module Title"
//               value={newModuleTitle}
//               onChange={(e) => setNewModuleTitle(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-lg mr-2 mb-2"
//             />
//             <button
//               type="button"
//               onClick={addModule}
//               className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Add Module
//             </button>
//           </div>

//           {modules.map((module, moduleIndex) => (
//             <div
//               key={module.id}
//               className="mb-6 border rounded-lg p-4 bg-gray-200 border-gray-600"
//             >
//               <h3 className="text-xl font-semibold mb-2">{module.title}</h3>

//               {module.lessons.map((lesson, lessonIndex) => (
//                 <div key={lesson.id} className="mb-4 border rounded-lg p-4 bg-white">
//                   <h4 className="text-lg font-semibold mb-2">
//                     Lesson {lessonIndex + 1}
//                   </h4>

//                   <input
//                     type="text"
//                     placeholder="Lesson Title"
//                     value={lesson.title}
//                     onChange={(e) =>
//                       handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)
//                     }
//                     className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
//                     required
//                   />

//                   <textarea
//                     placeholder="Lesson Description"
//                     value={lesson.lessonDescription}
//                     onChange={(e) =>
//                       handleLessonChange(moduleIndex, lessonIndex, "lessonDescription", e.target.value)
//                     }
//                     className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
//                     required
//                   ></textarea>

//                   <label className="block mb-2 text-sm font-medium text-gray-700">
//                     Upload Video
//                   </label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     name="video"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null;
//                       if (file && file.size > 50 * 1024 * 1024) {
//                         alert("Video file is too large. Please upload a file smaller than 50MB.");
//                         return;
//                       }
//                       handleLessonChange(moduleIndex, lessonIndex, "video", file);
//                     }}
//                     className="hidden"
//                     id={`video-upload-${module.id}-${lesson.id}`}
//                   />

//                   <label
//                     htmlFor={`video-upload-${module.id}-${lesson.id}`}
//                     className="cursor-pointer inline-block mb-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     {lesson.video ? "Replace Video" : "Upload Video"}
//                   </label>

//                   {lesson.video && (
//                     <div className="mb-2">
//                       <video controls className="w-full mb-2 rounded-lg" src={URL.createObjectURL(lesson.video)} />
//                       <button
//                         type="button"
//                         onClick={() => handleLessonChange(moduleIndex, lessonIndex, "video", null)}
//                         className="p-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
//                       >
//                         Remove Video
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() => addLesson(moduleIndex)}
//                 className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Add Lesson
//               </button>
//             </div>
//           ))}

//           <button
//             type="submit"
//             className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-800 mt-4"
//             onClick={handleNext}
//           >
//             Next
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCourse_Content;
