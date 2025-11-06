import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Extract userId and token properly from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.id;  // <-- direct access, since no nested "user"
  const token = userInfo?.token;


  // Review modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // ✅ Fetch user history
  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHistory(response.data || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [userId, token]);

  // --- Review Modal Handlers ---
  const handleOpenReviewModal = (order) => {
    setReviewingOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsModalOpen(false);
    setReviewingOrder(null);
    setRating(0);
    setReviewText("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/${reviewingOrder._id}/review`,
        { rating, review: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleCloseReviewModal();
      fetchHistory(); // Refresh after submitting review
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Could not submit your review. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Accepted":
      case "Picked Up":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Pickup History
        </h1>

        {loading ? (
          <p>Loading your history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">
            You haven’t made any scrap pickup requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Request ID: {order._id}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {order.items?.[0]?.itemType}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold">
                        {order.items?.[0]?.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Address</p>
                      <p className="font-semibold">
                        {order.pickupAddress?.street},{" "}
                        {order.pickupAddress?.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Slot</p>
                      <p className="font-semibold">
                        {order.timeSlot || "Not Scheduled Yet"}
                      </p>
                    </div>
                    {order.dealer && (
                      <div>
                        <p className="text-sm text-gray-500">Accepted By</p>
                        <p className="font-semibold">{order.dealer.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                  {order.status === "Completed" && !order.rating && (
                    <button
                      onClick={() => handleOpenReviewModal(order)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                      Leave a Review
                    </button>
                  )}
                  {order.rating && (
                    <div className="text-left">
                      <p className="font-semibold">Your Review:</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < order.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">{order.review}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Review Modal --- */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        rating={rating}
        setRating={setRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        order={reviewingOrder}
      />
    </div>
  );
};

// --- Review Modal Component ---
const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  rating,
  setRating,
  reviewText,
  setReviewText,
  order,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        <p className="mb-1">
          For your pickup of <strong>{order?.items?.[0]?.itemType}</strong>
        </p>
        <p className="mb-4 text-sm text-gray-500">
          with dealer <strong>{order?.dealer?.name}</strong>
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Rating
            </label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${ratingValue <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="reviewText"
              className="block text-gray-700 font-semibold mb-2"
            >
              Your Review (Optional)
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about your experience..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default History;
