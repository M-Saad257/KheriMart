import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  forwardRef
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProductDetail = forwardRef(({ onAddToCart, setIsCartOpen }, ref) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [curi, setCuri] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user: '', review: '' });

  const { user } = useContext(UserContext);

  const fetchProducts = useCallback(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setReviews(data.reviews || []);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
      });
  }, [id]);

  // Poll every 2 seconds
  useEffect(() => {
    fetchProducts(); // Initial fetch
    const interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  useEffect(() => {
    const fetchReviews = () => {
      fetch(`http://localhost:5000/api/reviews/${id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error('Failed to fetch reviews:', err));
    };

    fetchReviews(); // Initial fetch
    const interval = setInterval(fetchReviews, 2000); // Poll every 2 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, [id]);


  const handlePrev = () => {
    setCuri(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCuri(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.user.trim() || !newReview.review.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => [...prev, newReview]);
        setNewReview({ user: '', review: '' });
      } else {
        console.error('❌ Error submitting review:', data.error);
        alert('Failed to submit review.');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Network error while submitting review.');
    }
  };

  if (!product) {
    return <div className="pt-20 text-center text-red-600">Loading product...</div>;
  }
  return (
    <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto bg-white">
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Images */}
        <div className="flex flex-col items-center md:w-1/2 relative w-full">
          {product.sale && (
            <span className="absolute top-2 left-2 bg-[#9f6b4a] text-white px-2 py-1 rounded-md text-sm font-semibold shadow">
              - {product.salePercent}%
            </span>
          )}
          <img
            src={product.images[curi]}
            alt={product.title}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover rounded-md shadow mb-4"
          />
          <div className="flex justify-between w-full mt-2 md:relative md:-top-56">
            <button
              onClick={handlePrev}
              className="md:absolute md:-left-3 cursor-pointer hover:scale-125 transition-all duration-200 -rotate-90 bg-gray-300 p-2 rounded-full hover:bg-gray-400"
            >
              ▲
            </button>
            <button
              onClick={handleNext}
              className="md:absolute md:-right-3 cursor-pointer hover:scale-125 transition-all duration-200 rotate-90 bg-gray-300 p-2 rounded-full hover:bg-gray-400"
            >
              ▲
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex h-20 w-full gap-2 mt-1 p-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCuri(index)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200
          ${curi === index ? 'border-[#9f6b4a] scale-110' : 'border-transparent hover:border-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-[#9f6b4a] mb-4">{product.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>

          {product.sale ? (
            <>
              <p className="text-2xl font-semibold text-red-600 mb-6">
                ₨ {product.salePrice}{' '}
                <span className="text-gray-500 text-base line-through ml-2">
                  <strike>₨ {product.price}</strike>
                </span>
              </p>
            </>
          ) : (
            <p className="text-2xl font-semibold text-gray-800 mb-6">₨ {product.price}</p>
          )}
          {product.featured ? (
            <span className='rounded-2xl ml-15 text-white w-fit mb-2 bg-[#9f6b4a] relative right-13 md:right-13 p-1.5 text-center'>#Featured</span>
          ) : ("")}
          {user ? (
            <button
              onClick={() => {
                onAddToCart(product);
                setIsCartOpen(true);
              }}
              className={"bg-[#9f6b4a] rounded-2xl cursor-pointer text-white px-8 py-3 hover:bg-amber-700 transition"}
            >
              Add to Cart
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={"bg-[#9f6b4a] rounded-2xl cursor-pointer text-white px-8 py-3 hover:bg-amber-700 transition"}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="w-full border-2 border-gray-600 rounded-3xl p-4 mt-10">
        <h2 className="text-3xl font-bold text-[#9f6b4a] mb-6 text-center">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 mb-6">No reviews yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reviews.map((r, i) => (
              <div key={i} className="flex flex-col items-center justify-center border-2 border-gray-400 rounded-xl p-4 shadow-md">
                <h3 className="text-xl font-bold text-[#9f6b4a] mb-2">{r.user}</h3>
                <p className="text-gray-700 text-center">{r.review}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <input
            type="text"
            name="user"
            value={newReview.user}
            onChange={handleReviewChange}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9f6b4a]"
          />
          <textarea
            name="review"
            value={newReview.review}
            onChange={handleReviewChange}
            placeholder="Write your review here..."
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9f6b4a]"
          ></textarea>
          <button
            type="submit"
            className="bg-[#9f6b4a] cursor-pointer text-white px-6 py-2 rounded hover:bg-amber-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div >
  );
});

export default ProductDetail;
