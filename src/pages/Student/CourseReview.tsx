import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Loader2 } from "lucide-react";
import { config } from "../../configaration/Config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  userId: string; // Added to identify the reviewer
  createdAt: string;
}

interface CourseReviewProps {
  courseId: string;
}

const fetchWithAuth = async (endpoint: string, method = "GET", data?: any) => {
  return axios({
    url: `${API_URL}/${endpoint}`,
    method,
    data,
    ...config,
  });
};

const CourseReview: React.FC<CourseReviewProps> = ({ courseId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false); // Track if user has reviewed

  const { userDetails } = useSelector((state: RootState) => state.user); // Get current user

  // Fetch reviews and check if user has already reviewed
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`student/reviews/${courseId}`);
        console.log(response, "reviews response");
        const reviewData: Review[] = response.data.data || [];
        setReviews(reviewData);

        // Check if current user has already reviewed
        if (userDetails?._id) {
          const userReview = reviewData.find((review) => review.userId === userDetails._id);
          setHasReviewed(!!userReview);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId, userDetails]);

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setSubmitError("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (comment.trim().length === 0) {
      setSubmitError("Please provide a review comment.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const response = await fetchWithAuth(`student/addReviews/${courseId}`, "POST", {
        rating,
        comment,
      });
      const newReview: Review = response.data.data;
      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");
      setHasReviewed(true); // Mark user as having reviewed
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit review.";
      if (
        err.response?.status === 400 &&
        errorMessage.toLowerCase().includes("you can't rate multiple time")
      ) {
        setSubmitError("You have already submitted a review for this course.");
      } else {
        setSubmitError(errorMessage);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format date for reviews
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Reviews</h2>

      {/* Review Submission Form */}
      {hasReviewed ? (
        <p className="text-gray-600 text-center mb-8">
          You have already submitted a review for this course.
        </p>
      ) : (
        <form onSubmit={handleSubmitReview} className="mb-8">
          <div className="flex items-center mb-4">
            <label className="text-lg font-semibold text-gray-800 mr-4">Your Rating:</label>
            <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  aria-checked={rating === star}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Your Review:
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts about the course..."
              aria-describedby="comment-error"
            />
            <p className="text-sm text-gray-500 mt-1">{comment.length}/500 characters</p>
            {submitError && (
              <p id="comment-error" className="text-red-500 text-sm mt-2">
                {submitError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitLoading}
            className={`w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center ${
              submitLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Submit review"
          >
            {submitLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 font-medium">{error}</p>
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
        <div className="space-y-6 max-h-96 overflow-y-auto">
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
  );
};

export default CourseReview;
















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Star, Loader2 } from "lucide-react";
// import { config } from "../../configaration/Config";
// // import { fetchWithAuth } from "../../configaration/Config";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

// interface Review {
//   _id: string;
//   rating: number;
//   comment: string;
//   userName: string;
//   createdAt: string;
// }

// interface CourseReviewProps {
//   courseId: string;
// }

// const fetchWithAuth = async (endpoint: string, method = "GET", data?: any) => {
//     return axios({
//       url: `${API_URL}/${endpoint}`,
//       method,
//       data,
//       ...config,
//     });
//   };

// const CourseReview: React.FC<CourseReviewProps> = ({ courseId }) => {
//   const [rating, setRating] = useState<number>(0);
//   const [hoverRating, setHoverRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>("");
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [submitLoading, setSubmitLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   // Fetch reviews for the course
//   useEffect(() => {
//     const fetchReviews = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchWithAuth(`student/reviews/${courseId}`);
//         console.log(response,'ooopppppssss');
        
//         const reviewData: Review[] = response.data.data || [];
//         setReviews(reviewData);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load reviews.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReviews();
//   }, [courseId]);

//   // Handle review submission
//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (rating < 1 || rating > 5) {
//       setSubmitError("Please select a rating between 1 and 5 stars.");
//       return;
//     }
//     if (comment.trim().length === 0) { 
//       setSubmitError("Please provide a review comment.");
//       return;
//     }
//     setSubmitLoading(true);
//     setSubmitError(null);
//     try {
//       const response = await fetchWithAuth(`student/addReviews/${courseId}`, "POST", {
//         rating,
//         comment,
//       });
//       const newReview: Review = response.data.data;
//       setReviews([newReview, ...reviews]);
//       setRating(0);
//       setComment("");
//     } catch (err: any) {
//       setSubmitError(err.response?.data?.message || "Failed to submit review.");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // Format date for reviews
//   const formatDate = (dateString: string) => {
//     return new Intl.DateTimeFormat(navigator.language, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(new Date(dateString));
//   };

//   return (
//     <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Reviews</h2>

//       {/* Review Submission Form */}
//       <form onSubmit={handleSubmitReview} className="mb-8">
//         <div className="flex items-center mb-4">
//           <label className="text-lg font-semibold text-gray-800 mr-4">Your Rating:</label>
//           <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 type="button"
//                 onClick={() => setRating(star)}
//                 onMouseEnter={() => setHoverRating(star)}
//                 onMouseLeave={() => setHoverRating(0)}
//                 className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
//                 aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
//                 aria-checked={rating === star}
//                 tabIndex={0}
//                 onKeyDown={(e) => e.key === "Enter" && setRating(star)}
//               >
//                 <Star
//                   className={`w-6 h-6 ${
//                     (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="review-comment" className="block text-lg font-semibold text-gray-800 mb-2">
//             Your Review:
//           </label>
//           <textarea
//             id="review-comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value.slice(0, 500))}
//             maxLength={500}
//             rows={4}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             placeholder="Share your thoughts about the course..."
//             aria-describedby="comment-error"
//           />
//           <p className="text-sm text-gray-500 mt-1">{comment.length}/500 characters</p>
//           {submitError && (
//             <p id="comment-error" className="text-red-500 text-sm mt-2">
//               {submitError}
//             </p>
//           )}
//         </div>
//         <button
//           type="submit"
//           disabled={submitLoading}
//           className={`w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center ${
//             submitLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           aria-label="Submit review"
//         >
//           {submitLoading ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin mr-2" />
//               Submitting...
//             </>
//           ) : (
//             "Submit Review"
//           )}
//         </button>
//       </form>

//       {/* Reviews List */}
//       {loading ? (
//         <div className="flex items-center justify-center py-8">
//           <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//         </div>
//       ) : error ? (
//         <div className="text-center py-8">
//           <p className="text-red-500 font-medium">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
//           >
//             Retry
//           </button>
//         </div>
//       ) : reviews.length === 0 ? (
//         <p className="text-gray-500 italic text-center py-8">No reviews yet. Be the first to share your feedback!</p>
//       ) : (
//         <div className="space-y-6 max-h-96 overflow-y-auto">
//           {reviews.map((review) => (
//             <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-5 h-5 ${
//                         star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <p className="text-sm font-medium text-gray-800">{review.userName}</p>
//                 <p className="text-sm text-gray-500">· {formatDate(review.createdAt)}</p>
//               </div>
//               <p className="text-gray-600">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseReview;