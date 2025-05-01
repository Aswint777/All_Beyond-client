import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserNavbar from "../../components/layout/UserNavbar";
import BasicNavbar from "../../components/layout/BasicNavbar";
import { fetchCourseDetails, fetchSimilarCourses } from "../../services/courseService";
import { alreadyEnrolledCourses } from "../../services/userService";
import CourseActionModal from "../../components/reusableComponents/CourseActionModal";
import { ROUTES } from "../../utils/paths";
import axios from "axios";
import { config } from "../../configaration/Config";
import { Star, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  categoryName?: string;
  instructor?: string;
  aboutInstructor?: string;
  content?: {
    moduleTitle: string;
    lessons: {
      lessonTitle: string;
      lessonDescription?: string;
      video?: string;
    }[];
  }[];
  pricingOption?: "Premium" | "Free";
  price?: number;
  user?: { _id: string; name: string };
  thumbnailUrl?: string;
  rating?: number;
  reviews?: number;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface AverageReview {
  count: number;
  average: number;
}

interface CourseResponse {
  course: ICourse;
  reviewStatus: AverageReview;
}

// Format date for reviews
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

const fetchWithAuth = async (endpoint: string, method = "GET", data?: any) => {
  return axios({
    url: `${API_URL}/${endpoint}`,
    method,
    data,
    ...config,
  });
};

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [similarCourses, setSimilarCourses] = useState<ICourse[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [averageReview, setAverageReview] = useState<AverageReview | null>(null); // For reviewStatus

  const navigate = useNavigate();
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }
      try {
        const courseDataResponse = await fetchCourseDetails(courseId);
        const { course, reviewStatus }: CourseResponse = courseDataResponse;
        console.log(courseDataResponse, "courseDataResponse");
        setCourse(course);
        setAverageReview(reviewStatus);

        const similarCoursesData = await fetchSimilarCourses(courseId);
        setSimilarCourses(similarCoursesData);

        if (userDetails) {
          const enrolled = await alreadyEnrolledCourses(courseId);
          console.log(enrolled, "kk");
          setIsEnrolled(enrolled);
        }

        // Fetch reviews separately
        try {
          setReviewLoading(true);
          const response = await fetchWithAuth(`student/reviews/${courseId}`);
          console.log(response, "reviews response");
          const reviewData: Review[] = response.data.data|| [];
          setReviews(reviewData);
        } catch (err: any) {
          setReviewError(err.response?.data?.message || "Failed to load reviews.");
        } finally {
          setReviewLoading(false);
        }
      } catch (error) {
        setError("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, [courseId, userDetails]);

  const getFirstVideoUrl = () => {
    if (course?.content && Array.isArray(course.content)) {
      for (const module of course.content) {
        if (module.lessons && Array.isArray(module.lessons)) {
          for (const lesson of module.lessons) {
            if (lesson.video) return lesson.video;
          }
        }
      }
    }
    return null;
  };

  const firstVideoUrl = getFirstVideoUrl();

  const handleButtonClick = () => {
    if (!userDetails) {
      navigate("/");
      return;
    }

    if (isEnrolled) {
      navigate(`/student/WatchCourses/${courseId}`);
      return;
    }

    if (course?.pricingOption === "Premium" && (!course.price || course.price <= 0)) {
      setError("Invalid price for premium course.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleEnroll = () => {
    console.log("Free course enrollment confirmed:", course?.courseTitle);
    setIsModalOpen(false);
    navigate(`${ROUTES.STUDENT}${ROUTES.PAYMENT_SUCCESS}?courseId=${courseId}`);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setIsModalOpen(false);
      navigate(`${ROUTES.STUDENT}${ROUTES.PAYMENT_SUCCESS}?courseId=${courseId}`);
    } catch (error) {
      console.error("Error enrolling after payment:", error);
      setError("Payment succeeded, but enrollment failed. Please contact support.");
    }
  };

  if (!course && !error) {
    return (
      <div className="text-center text-gray-500 mt-10">
        {userDetails ? <UserNavbar /> : <BasicNavbar />}
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {userDetails ? <UserNavbar /> : <BasicNavbar />}
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {userDetails ? <UserNavbar /> : <BasicNavbar />}
      <div className="max-w-6xl mx-auto p-6 mt-24">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-2/3 h-80">
            {isVideoPlaying && firstVideoUrl ? (
              <video
                src={firstVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover rounded-lg"
                onEnded={() => setIsVideoPlaying(false)}
              />
            ) : (
              <>
                <img
                  src={course?.thumbnailUrl || "/default-course.jpg"}
                  alt={course?.courseTitle}
                  className="w-full h-full object-cover rounded-lg"
                />
                {firstVideoUrl && (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white rounded-lg hover:bg-opacity-50 transition"
                  >
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
          <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{course?.courseTitle}</h1>
            <p className="text-gray-700 mt-2 text-xl">Created By: {course?.instructor || "Unknown"}</p>
            <p className="text-xl font-bold mt-2">
              ⭐ {averageReview?.average || "No ratings"} ({averageReview?.count || 0} Reviews)
            </p>
            <p className="mt-4 font-semibold text-3xl">
              Price:{" "}
              {course?.pricingOption === "Premium" ? (
                <span className="text-green-600 font-semibold">₹{course.price}</span>
              ) : (
                "Free"
              )}
            </p>
            <button
              onClick={handleButtonClick}
              className={`mt-4 py-2 px-4 rounded-lg text-white ${
                isEnrolled
                  ? "bg-green-600 hover:bg-green-700"
                  : course?.pricingOption === "Premium"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isEnrolled === true
                ? "Go to Course"
                : course?.pricingOption === "Premium"
                ? "Purchase Now"
                : "Enroll Now"}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">About</h2>
          <p className="text-lg text-gray-600 mt-4">{course?.courseDescription}</p>
          {course?.content && course.content.length > 0 ? (
            <ul className="mt-3">
              {course.content.map((module, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{module.moduleTitle}</h3>
                  <ul className="ml-4 list-disc text-gray-700">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex}>{lesson.lessonTitle}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No course content available.</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">Reviews</h2>
          {reviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : reviewError ? (
            <div className="text-center py-8">
              <p className="text-red-500 font-medium">{reviewError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">
              No reviews yet. Be the first to share your feedback!
            </p>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto mt-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{review.userName}</p>
                    <p className="text-sm text-gray-500">· {formatDate(review.createdAt)}</p>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">Similar Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {similarCourses.map((course) => (
              <div key={course._id} className="shadow-md rounded-lg overflow-hidden bg-slate-200">
                <img
                  src={course.thumbnailUrl || "/default-course.jpg"}
                  alt={course.courseTitle}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{course.courseTitle}</h2>
                  <p className="text-sm text-gray-600">
                    Instructor: {course.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm font-bold mt-2">
                    ⭐ {course.rating || 0} ({course.reviews || 0} Reviews)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CourseActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPremium={course?.pricingOption === "Premium"}
        courseTitle={course?.courseTitle || ""}
        courseId={course?._id || ""}
        price={course?.price || 0}
        onConfirm={handleEnroll}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetails;



