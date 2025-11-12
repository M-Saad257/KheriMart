import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router-dom";

const Checkout = ({ cartItems: initialCartItems, clearCart }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/orders/checkout/${user._id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
          });
        })
        .catch(err => console.error('Failed to fetch user info:', err));
    }
  }, [user]);

  const total = cartItems?.reduce((sum, item) => {
    let price = item.productId?.sale ? item.productId?.salePrice : item.productId?.price;
    if (typeof price === "string") {
      price = Number(price.replace("₨", "").replace(/,/g, ""));
    }
    return sum + price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const cleanedItems = cartItems.map(item => ({
      productId: item.productId?._id || item._id,
      quantity: item.quantity,
      price: item.productId?.sale ? item.productId?.salePrice : item.productId?.price,
      salePrice: item.productId?.salePrice || null
    }));

    const order = {
      userId: user._id,
      items: cleanedItems,
      total,
      ...formData,
      paymentMethod: "Cash on Delivery",
      date: new Date()
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Your order has been placed!");

        if (user && user._id) {
          try {
            await fetch(`http://localhost:5000/api/cart/user/${user._id}`, {
              method: "DELETE",
            });
          } catch (err) {
            console.error("Failed to clear cart in backend:", err);
          }
        }

        clearCart();
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mt-12 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Summary */}
          <div className="border rounded-lg p-4 mb-6">
            {cartItems.map((product, index) => {
              const title = product.productId?.title || product.title;
              let price = product.productId?.sale ? product.productId?.salePrice : product.productId?.price;
              if (price === undefined) {
                price = product.sale ? product.salePrice : product.price;
              }
              const images = product.productId?.images || product.images;

              // Handlers for quantity and delete
              const handleIncrement = () => {
                product.quantity += 1;
                setCartItems([...cartItems]);
              };

              const handleDecrement = () => {
                if (product.quantity > 1) {
                  product.quantity -= 1;
                  setCartItems([...cartItems]);
                }
              };

              const handleDelete = () => {
                const newCart = cartItems.filter((_, i) => i !== index);
                setCartItems(newCart);
              };

              return (
                <div key={product._id || index} className="flex justify-between items-center mb-2 border-b pb-2">
                  <div className="flex items-center">
                    <img src={images?.[0]} alt="image" className="w-12 h-12 mr-4 object-cover rounded" />
                    <span className="mr-4">{title}</span>

                    {/* Quantity controls */}
                    <div className="flex items-center border rounded px-2">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="px-2 text-lg font-bold hover:bg-gray-200 rounded"
                      >-</button>
                      <span className="px-2">{product.quantity}</span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="px-2 text-lg font-bold hover:bg-gray-200 rounded"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-xl cursor-pointer mr-10"
                    >
                      🗑
                    </button>
                    <span className="mr-4">₨ {(price * product.quantity).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>₨ {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="font-bold">Name:</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <div className="font-bold">Email:</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <div className="font-bold">Address:</div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="2"
              required
            ></textarea>
            <div className="font-bold">Phone #:</div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* Payment Method Card */}
            <div
              className="border rounded-lg p-4 shadow-md border-green-500 bg-green-50"
            >
              <h4 className="text-md font-semibold">💵 Cash on Delivery</h4>
              <p className="text-gray-600 text-sm">Pay in cash when your order arrives.</p>
            </div>

            <button
              type="submit"
              className="bg-green-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Place Order
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Checkout;
