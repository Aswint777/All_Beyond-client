import React, { useState } from "react";
import { Question } from "../../Interface/assessments";
import { Plus, Trash2 } from "lucide-react";

interface AssessmentFormProps {
  initialData?: {
    id?: string;
    questions: Question[];
  };
  courseId: string;
  courseTitle: string;
  onSubmit: (data: { questions: Question[] }) => Promise<void>;
  isEditMode?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialData,
  courseId,
  courseTitle,
  onSubmit,
  isEditMode = false,
}) => {
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions.length
      ? initialData.questions
      : [
          {
            courseId,
            question: "",
            options: ["", "", "", ""],
            correctOption: 1, // 1-based
          },
        ]
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    questions.forEach((q, qIndex) => {
      if (!q.question.trim())
        newErrors[`question-${qIndex}`] = "Question is required";
      q.options.forEach((option, oIndex) => {
        if (!option.trim())
          newErrors[`option-${qIndex}-${oIndex}`] = `Option ${
            oIndex + 1
          } is required`;
      });
      if (q.correctOption < 1 || q.correctOption > q.options.length)
        newErrors[`correctOption-${qIndex}`] = "Select a valid correct option";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const updatedQuestions = questions.map((q) => ({ ...q, courseId }));
      await onSubmit({ questions: updatedQuestions });
      setErrors({});
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Submission error:", error);
      setErrors({
        form: error.message || "Failed to save assessment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        courseId,
        question: "",
        options: ["", "", "", ""],
        correctOption: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
    setErrors((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        if (
          !key.startsWith(`question-${index}-`) &&
          !key.startsWith(`option-${index}-`)
        ) {
          acc[key] = prev[key];
        }
        return acc;
      }, {} as { [key: string]: string })
    );
  };

  type QuestionFieldValue<T extends keyof Question> = Question[T];

  const updateQuestion = <T extends keyof Question>(
    index: number,
    field: T,
    value: QuestionFieldValue<T>
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    newQuestions[index].courseId = courseId;
    setQuestions(newQuestions);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-8 rounded-2xl shadow-xl animate-fade-in"
      noValidate
    >
      {errors.form && (
        <p className="text-red-600 text-sm font-medium" role="alert">
          {errors.form}
        </p>
      )}
      <div className="text-sm font-medium text-gray-700"></div>
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border border-gray-200 rounded-lg p-6 space-y-6 relative bg-gray-50 animate-fade-in"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Question {qIndex + 1}
          </h3>
          {questions.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Remove question ${qIndex + 1}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <div>
            <label
              htmlFor={`question-${qIndex}`}
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <textarea
              id={`question-${qIndex}`}
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
              rows={4}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-y transition-all duration-200"
              placeholder="Enter the question"
              aria-invalid={!!errors[`question-${qIndex}`]}
              aria-describedby={
                errors[`question-${qIndex}`]
                  ? `question-${qIndex}-error`
                  : undefined
              }
            />
            {errors[`question-${qIndex}`] && (
              <p
                id={`question-${qIndex}-error`}
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors[`question-${qIndex}`]}
              </p>
            )}
          </div>
          {q.options.map((option, oIndex) => (
            <div key={oIndex}>
              <label
                htmlFor={`option-${qIndex}-${oIndex}`}
                className="block text-sm font-medium text-gray-700"
              >
                Option {oIndex + 1}
              </label>
              <input
                id={`option-${qIndex}-${oIndex}`}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...q.options];
                  newOptions[oIndex] = e.target.value;
                  updateQuestion(qIndex, "options", newOptions);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200"
                placeholder={`Enter option ${oIndex + 1}`}
                aria-invalid={!!errors[`option-${qIndex}-${oIndex}`]}
                aria-describedby={
                  errors[`option-${qIndex}-${oIndex}`]
                    ? `option-${qIndex}-${oIndex}-error`
                    : undefined
                }
              />
              {errors[`option-${qIndex}-${oIndex}`] && (
                <p
                  id={`option-${qIndex}-${oIndex}-error`}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors[`option-${qIndex}-${oIndex}`]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label
              htmlFor={`correctOption-${qIndex}`}
              className="block text-sm font-medium text-gray-700"
            >
              Correct Option
            </label>
            <select
              id={`correctOption-${qIndex}`}
              value={q.correctOption}
              onChange={(e) =>
                updateQuestion(qIndex, "correctOption", Number(e.target.value))
              }
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200"
              aria-invalid={!!errors[`correctOption-${qIndex}`]}
              aria-describedby={
                errors[`correctOption-${qIndex}`]
                  ? `correctOption-${qIndex}-error`
                  : undefined
              }
            >
              {q.options.map((option, index) => (
                <option key={index} value={index + 1} disabled={!option.trim()}>
                  {option.trim()
                    ? `Option ${index + 1}: ${option}`
                    : `Option ${index + 1} (Empty)`}
                </option>
              ))}
            </select>
            {errors[`correctOption-${qIndex}`] && (
              <p
                id={`correctOption-${qIndex}-error`}
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors[`correctOption-${qIndex}`]}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          aria-label="Add new question"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </button>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all duration-200"
          aria-label={isEditMode ? "Update assessment" : "Create assessment"}
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Assessment"
            : "Create Assessment"}
        </button>
      </div>
    </form>
  );
};

export default AssessmentForm;
