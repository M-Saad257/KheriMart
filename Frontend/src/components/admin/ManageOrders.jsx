import React, { useEffect, useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);


  useEffect(() => {
    const fetchOrders = () => {
      fetch("http://localhost:5000/api/orders")
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error("Error fetching orders:", err));
    };

    const fetchUsers = () => {
      fetch("http://localhost:5000/api/users")
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error fetching users:", err));
    };

    fetchOrders();
    fetchUsers();
    const interval = setInterval(() => {
      fetchOrders();
      fetchUsers();
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  // Update order status
  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status: updatedOrder.status } : order
          )
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  // Filter out orders with no matching user, and add city info
  const ordersWithCity = orders
    .filter(order => users.some(u => u._id === order.userId))
    .map(order => {
      const user = users.find(u => u._id === order.userId);
      return {
        ...order,
        city: user.city
      };
    });

  // Unique cities for dropdown
  const cities = [...new Set(ordersWithCity.map((o) => o.city).filter(Boolean))];

  // Filter orders by selected city
  const filteredOrders = selectedCity
    ? ordersWithCity.filter((order) => order.city === selectedCity)
    : ordersWithCity;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl text-[#9f6b4a] md:text-2xl pt-12 text-center font-bold mb-4">
        Manage Orders
      </h2>

      {orders.length === 0 || users.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <>
          {/* City Dropdown */}
          <div className="inline-block relative group mb-4">
            <div className="inline bg-gray-200 p-2 rounded-xl cursor-pointer">
              <span className="text-xl mr-0.5">Cities</span>
              <span className="inline-block ml-0.5 text-[15px] rotate-90 group-hover:rotate-180 transition-transform duration-150">▲</span>
            </div>
            <ul className="hidden absolute left-15 mt-1.5 list-none rounded-xl shadow-md bg-white group-hover:block max-h-60 overflow-y-auto">
              <li
                className="px-4 py-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                onMouseOver={() => setSelectedCity("")}
                onClick={() => setSelectedCity("")}
              >
                All
              </li>
              {cities.map((city) => (
                <li
                  key={city}
                  className="px-4 py-2 rounded-xl hover:bg-gray-200 cursor-pointer"
                  onMouseOver={() => setSelectedCity(city)}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Table */}
          <div className="hidden mt-4 md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">City</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Payment Method</th>
                  <th className="border p-2">Placed At</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-center text-[17px] hover:bg-gray-50 transition">
                    <td className="border p-2">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="border p-2">{order.name}</td>
                    <td className="border p-2 break-all">{order.email}</td>
                    <td className="border p-2">{order.city}</td>
                    <td className="border p-2">₨ {order.total}</td>
                    <td className="border p-2">{order.paymentMethod || "N/A"}</td>
                    <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="border p-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border rounded p-1 text-xs md:text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded text-xs md:text-sm hover:bg-blue-600 transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <p className="font-bold text-sm">Order ID: {order._id.slice(-6).toUpperCase()}</p>
                <p>Customer: {order.name}</p>
                <p className="break-all text-sm">Email: {order.email}</p>
                <p>City: {order.city}</p>
                <p>Total: ₨{order.total}</p>
                <p>Payment: {order.paymentMethod || "N/A"}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

                <div className="mt-2">
                  <label className="block text-xs mb-1 font-semibold">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded p-1 w-full text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="mt-3 cursor-pointer w-full bg-blue-500 text-white py-1 rounded text-xs hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed text-xl inset-0 backdrop-blur-xl bg-opacity-40 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id.slice(-6).toUpperCase()}</p>
            <p><strong>Customer:</strong> {selectedOrder.name}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>City:</strong> {selectedOrder.city}</p>
            <p><strong>Payment method:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <div className="mt-4">
              <strong>Items:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>{item.productId?.title || "Unknown Product"} × {item.quantity} — ₨{item.price}</li>
                ))}
              </ul>
            </div>
            <p className="mt-4 font-bold">Total: ₨{selectedOrder.total}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
