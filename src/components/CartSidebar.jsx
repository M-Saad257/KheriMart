import React, { useContext, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose, cartItems, setIsCartOpen, setCartItems, getcarts }) => {
  const navigate = useNavigate();


  // Increase quantity
  const handleIncrease = (item) => {
    setCartItems(prev =>
      prev.map(p =>
        p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  // Decrease quantity
  const handleDecrease = (item) => {
    setCartItems(prev =>
      prev.map(p =>
        p._id === item._id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  // Remove item
  const handleRemove = async (id) => {
    try {
      // Call backend to delete from DB
      let res = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: 'DELETE',
      });
      res = await res.json()
      if (res.success) {
        getcarts()
        alert("Product Successfully Deleted From Cart")
      } else {
        alert("Cart Deletion Failed!")
      }
    } catch (err) {
      alert('Failed to delete item from cart.');
      console.error(err.message);
    }
  };


  const total = cartItems?.reduce((sum, item) => {
    let price = item.productId?.sale ? item.productId?.salePrice : item.productId?.price;

    if (typeof price === 'string') {
      price = Number(price.replace('₨', '').replace(/,/g, ''));
    }

    return sum + price * item.quantity;
  }, 0);


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
          <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button className='cursor-pointer' onClick={onClose}>
            <FaTimes className="text-gray-600 cursor-pointer hover:text-black" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {cartItems?.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems?.map((product) => {
              const title = product.productId?.title || product.title;
              let price = product.productId?.sale ? product.productId?.salePrice : product.productId?.price;
              if (price === undefined) {
                price = product.sale ? product.salePrice : product.price;
              }
              const images = product.productId?.images || product.images;

              return (
                <div key={product._id || product.productId?._id} className="flex flex-col border-b pb-4 gap-2">
                  <div className="flex items-center gap-4">
                    <img src={images?.[0]}
                      alt={product.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="text-sm font-semibold">{title}</h3>
                      {product.productId?.sale ? (
                        <p className="text-amber-900 font-bold">{product.productId?.salePrice}</p>
                      ) : (<p className="text-amber-900 font-bold">{price}</p>)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(product)}
                        className="px-2 cursor-pointer py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >−</button>
                      <span className="text-md font-semibold">{product.quantity}</span>
                      <button
                        onClick={() => handleIncrease(product)}
                        className="px-2 cursor-pointer py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >+</button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-xl cursor-pointer text-gray-600 hover:text-red-600"
                    >
                      🗑
                    </button>

                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Total & Checkout */}
        {cartItems?.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Total:</span>
              <span className="text-amber-900 font-bold text-lg">₨ {total.toLocaleString()}</span>
            </div>
            <button className="w-full cursor-pointer bg-[#9f6b4a] text-white py-2 rounded hover:bg-amber-700 transition"
              onClick={() => {
                navigate('/checkout')
                setIsCartOpen(false)
              }
              }
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
