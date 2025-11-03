import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const FP = ({ setIsCartOpen, onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const fetchFeaturedProducts = () => {
      fetch('http://localhost:5000/api/products')
        .then(res => res.json())
        .then(data => {
          const filtered = data
            .filter(prod => prod.featured)
            .sort((a, b) => {
              if (a.sale && !b.sale) return -1;
              if (!a.sale && b.sale) return 1;
              return 0;
            });
          setFeaturedProducts(filtered);
        })
        .catch(err => console.error('Failed to fetch products:', err));
    };
    fetchFeaturedProducts();
    interval = setInterval(fetchFeaturedProducts, 2000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="pt-20 pb-10 bg-white px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl text-center font-bold text-[#9f6b4a] mb-6">Featured Products</h2>

      {featuredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No featured products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {featuredProducts.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
              <div className="relative">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover text-center rounded-md mb-4 transition duration-1000 hover:shadow-lg"
                    onError={(e) => (e.target.src = '/fallback.jpg')}
                  />
                </Link>

                {product.sale && (
                  <span className="absolute top-2 left-2 bg-[#9f6b4a] text-white px-2 py-1 rounded-md text-sm font-semibold shadow">
                    - {product.salePercent}%
                  </span>
                )}
              </div>

              <Link to={`/product/${product._id}`}>
                <h3 className="text-xl font-semibold text-center hover:underline text-[#9f6b4a]">
                  {product.title}
                </h3>
              </Link>

              {product.sale ? (
                <p className="text-red-600 text-center font-semibold mt-1">
                  ₨ {product.salePrice}
                  <span className="text-gray-500 line-through ml-2 text-sm">
                    <strike>₨ {product.price}</strike>
                  </span>
                </p>
              ) : (
                <p className="text-amber-900 text-center font-bold mt-1">₨ {product.price}</p>
              )}

              <div className="mt-auto pt-4">
                {user ? (
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      setIsCartOpen(true);
                    }}
                    className="bg-[#9f6b4a] rounded-2xl cursor-pointer text-white px-8 py-3 hover:bg-amber-700 transition w-full"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#9f6b4a] rounded-2xl cursor-pointer text-white px-8 py-3 hover:bg-amber-700 transition w-full"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          to="/prods"
          className="text-[18px] inline-block bg-[#9f6b4a] text-white py-2 px-6 rounded-lg hover:bg-amber-900"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default FP;
