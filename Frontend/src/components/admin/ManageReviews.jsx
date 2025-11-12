import React, { useEffect, useState } from 'react';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = () => {
      fetch('http://localhost:5000/api/reviews')
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error('Failed to fetch reviews:', err));
    };

    fetchReviews(); // initial fetch
    const interval = setInterval(fetchReviews, 2000); // fetch every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const handleDeleteReview = async (productId, reviewIndex) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/${productId}/${reviewIndex}`,
        { method: 'DELETE' }
      );

      if (!res.ok) throw new Error('Failed to delete review');

      // Re-fetch reviews after successful deletion
      const updated = await fetch('http://localhost:5000/api/reviews');
      const updatedReviews = await updated.json();
      setReviews(updatedReviews);
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  // Group reviews by productId
  const groupedReviews = reviews.reduce((acc, review) => {
    if (!acc[review.productId]) {
      acc[review.productId] = [];
    }
    acc[review.productId].push(review);
    return acc;
  }, {});

  return (
    <div className="pt-12 px-4">
      <h2 className="text-2xl text-center font-bold text-[#9f6b4a] mb-4">Manage Reviews</h2>

      {Object.keys(groupedReviews).length === 0 ? (
        <p className='text-center'>No reviews found.</p>
      ) : (
        Object.entries(groupedReviews).map(([productId, productReviews], productIndex) => (
          <div key={productId} className="mb-8">
            <h3 className="text-lg font-bold mb-2 text-[#9f6b4a]">
              {productIndex + 1} : {productReviews[0].productTitle}
            </h3>
            {productReviews.map((r, idx) => (
              <div
                key={idx}
                className="mb-4 border border-gray-300 rounded-lg p-4 shadow bg-white flex gap-4 items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={r.productImage}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm text-gray-500">
                      Review {idx + 1}
                    </p>
                    <p>
                      <span className="font-semibold">{r.user}</span>
                      <div>{r.review}</div>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReview(productId, idx)}
                  className="text-red-600 cursor-pointer text-xl hover:scale-125 transition-transform"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ManageReviews;
