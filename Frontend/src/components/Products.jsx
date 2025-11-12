import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Products = ({ onAddToCart, setIsCartOpen }) => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Fetch products
  const fetchProducts = useCallback(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Poll every 2 seconds
  useEffect(() => {
    fetchProducts(); 
    const interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval); 
  }, [fetchProducts]);

  // Filter products
  let filteredProducts = products.filter(product => {
    if (filter === "onsale") return product.sale === true;
    if (filter === "featured") return product.featured === true;
    return true;
  });

  // Sort products
  if (sort === "lowtohigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.sale ? a.salePrice : a.price;
      const priceB = b.sale ? b.salePrice : b.price;
      return priceA - priceB;
    });
  } else if (sort === "hightolow") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.sale ? a.salePrice : a.price;
      const priceB = b.sale ? b.salePrice : b.price;
      return priceB - priceA;
    });
  }

  return (
    <div className="py-24 mb-36 bg-white px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl text-center font-bold text-[#9f6b4a] mb-6">Our Products</h2>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-2xl cursor-pointer border ${filter === "all" ? "bg-[#9f6b4a] text-white" : "bg-white text-[#9f6b4a]"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-2xl cursor-pointer border ${filter === "onsale" ? "bg-[#9f6b4a] text-white" : "bg-white text-[#9f6b4a]"}`}
          onClick={() => setFilter("onsale")}
        >
          On Sale
        </button>
        <button
          className={`px-4 py-2 rounded-2xl cursor-pointer border ${filter === "featured" ? "bg-[#9f6b4a] text-white" : "bg-white text-[#9f6b4a]"}`}
          onClick={() => setFilter("featured")}
        >
          Featured
        </button>

        <select
          className="px-3 py-2 cursor-pointer rounded-2xl border bg-white text-[#9f6b4a]"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="lowtohigh">Price: Low to High</option>
          <option value="hightolow">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col h-full"
            >
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

              {product.featured && (
                <p className="mt-1 text-center">
                  <span className="rounded-2xl inline-block text-white bg-[#9f6b4a] px-3 py-1 text-sm">
                    #featured
                  </span>
                </p>
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
    </div>
  );
};

export default Products;
