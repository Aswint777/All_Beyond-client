import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  coursePayment,
  enrollCourse,
  initializeProgress,
} from "../../services/paymentService";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

interface CourseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  courseTitle: string;
  courseId: string;
  price: number;
  onConfirm: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
}

const CheckoutForm: React.FC<{
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  courseId: string;
  price: number;
}> = ({ onClose, onPaymentSuccess, courseId, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const clientSecret = await coursePayment(courseId, price);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement! },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else {
        await enrollCourse(courseId);
        await initializeProgress(courseId);
        onPaymentSuccess(result.paymentIntent.id);
        onClose();
      }
    } catch (err) {
      setError("An error occurred during payment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={processing || !stripe}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
        >
          {processing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const CourseActionModal: React.FC<CourseActionModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  courseTitle,
  courseId,
  price,
  onConfirm,
  onPaymentSuccess,
}) => {
  const [enrollError, setEnrollError] = React.useState<string | null>(null);
  const [enrollProcessing, setEnrollProcessing] = React.useState(false);

  if (!isOpen) return null;

  const handleEnroll = async () => {
    setEnrollProcessing(true);
    setEnrollError(null);
    try {
      await enrollCourse(courseId);
      await initializeProgress(courseId);

      onConfirm();
      onClose();
    } catch (err) {
      setEnrollError("Failed to enroll in the course. Please try again.");
    } finally {
      setEnrollProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300">
        {isPremium ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Purchase "{courseTitle}"
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg mb-6 shadow-inner">
              <p className="text-gray-700 text-lg font-medium">
                Amount:{" "}
                <span className="text-purple-700 font-semibold">₹{price}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1.9-2 2-2m-2 6c-1.1 0-2-.9-2-2m2-6a9 9 0 110 18 9 9 0 010-18zm0 0v6m0 0h6"
                  />
                </svg>
                Secured by Stripe
              </p>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                onClose={onClose}
                onPaymentSuccess={onPaymentSuccess}
                courseId={courseId}
                price={price}
              />
            </Elements>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Enroll in "{courseTitle}"
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-8 text-lg">
              Are you sure you want to enroll in this free course?
            </p>
            {enrollError && (
              <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {enrollError}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleEnroll}
                disabled={enrollProcessing}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                {enrollProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Enrolling...
                  </>
                ) : (
                  "Yes, Enroll"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={enrollProcessing}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseActionModal;
