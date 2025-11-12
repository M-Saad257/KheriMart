import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserDb = ({ setCartItems }) => {
    const { user, setUser } = useContext(UserContext);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Poll orders & users every 2 seconds
    useEffect(() => {
        let interval;
        if (user && user._id) {
            const fetchData = () => {
                fetch(`http://localhost:5000/api/orders/${user._id}`)
                    .then(res => res.json())
                    .then(data => setOrders(data))
                    .catch(err => console.error("Error fetching orders:", err));

                fetch('http://localhost:5000/api/users')
                    .then(res => res.json())
                    .catch(err => console.error("Error fetching users:", err));
            };

            fetchData(); // initial fetch
            interval = setInterval(fetchData, 2000);
        }
        return () => clearInterval(interval);
    }, [user]);

    const GotoProd = () => {
        navigate(`/prods`);
    };

    const handleLogout = () => {
        setCartItems([]);
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
        alert("User has been logged out!!");
    };

    // Always get the latest order data for modal
    const selectedOrder = orders.find(o => o._id === selectedOrderId);

    return (
        <div className="max-w-4xl mx-auto mt-12 mb-31 p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 👋</h1>
            <p className="mb-6 font-semibold text-gray-700">Email: {user.email}</p>
            <div className="flex flex-row justify-between mb-5">
                <h2 className="text-xl font-semibold mb-3 inline">My Orders</h2>
                <button
                    onClick={GotoProd}
                    className="cursor-pointer inline-block bg-[#9f6b4a] text-white py-2 px-6 rounded-lg hover:bg-amber-900"
                >
                    Choose Products
                </button>
            </div>

            {orders.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-center">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4">Order ID</th>
                                <th className="py-2 px-4">Item(s)</th>
                                <th className="py-2 px-4">Price</th>
                                <th className="py-2 px-4">Payment method</th>
                                <th className="py-2 px-4">Track Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-t">
                                    <td className="py-2 px-4">
                                        {order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="py-2 text-left px-4">
                                        {order.items.map(item => (
                                            <div key={item._id}>
                                                {item.productId?.title || "Unknown Product"} × {item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4">₨ {order.total.toLocaleString()}</td>
                                    <td className="py-2 px-4">{order.paymentMethod || "N/A"}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded text-xs md:text-[17px] hover:bg-blue-600 transition"
                                            onClick={() => setSelectedOrderId(order._id)}
                                        >
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-2xl text-[#6e3716] ml-16 font-bold my-4">
                    {user.name} has no orders yet.
                </div>
            )}

            <button
                className="mt-6 cursor-pointer bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={handleLogout}
            >
                Logout
            </button>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 backdrop-blur-xl bg-opacity-40 flex justify-center items-center z-50 p-2">
                    <div className="bg-white text-xl p-4 md:p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Order Tracking</h3>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="font-bold py-2 px-4">Order ID:</td>
                                    <td className="py-2">{selectedOrder._id.slice(-6).toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-2 px-4">Status:</td>
                                    <td className="py-2">{selectedOrder.status}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-2 px-4">Date:</td>
                                    <td className="py-2">{new Date(selectedOrder.createdAt).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold py-2 px-4">Total:</td>
                                    <td className="py-2">₨{selectedOrder.total}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Progress Tracker */}
                        <div className="mt-6">
                            {(() => {
                                const steps = ["Pending", "Processing", "Shipped", "Delivered"];
                                const cancelledStep = "Cancelled";
                                const currentStatus = selectedOrder.status;

                                let currentIndex = steps.findIndex(
                                    step => step.toLowerCase() === currentStatus.toLowerCase()
                                );

                                if (currentStatus.toLowerCase() === "cancelled") {
                                    currentIndex = -1;
                                }

                                let explainText = "";
                                if (currentStatus.toLowerCase() === "pending") {
                                    explainText = "Your order has been received and is awaiting processing.";
                                } else if (currentStatus.toLowerCase() === "processing") {
                                    explainText = "Your order is being prepared. Hang tight!";
                                } else if (currentStatus.toLowerCase() === "shipped") {
                                    explainText = "Your order is on the way. 🚚";
                                } else if (currentStatus.toLowerCase() === "delivered") {
                                    explainText = "Your order has been delivered. 🎉";
                                } else if (currentStatus.toLowerCase() === "cancelled") {
                                    explainText = "This order has been cancelled.";
                                }

                                return (
                                    <>
                                        <div className="flex items-center justify-between relative">
                                            {currentStatus.toLowerCase() !== "cancelled" ? (
                                                <>
                                                    {steps.map((step, index) => (
                                                        <div key={step} className="flex flex-col items-center text-sm">
                                                            <div
                                                                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${index <= currentIndex
                                                                    ? "bg-green-500 border-green-500 text-white z-10"
                                                                    : "bg-gray-200 border-gray-300 text-gray-500 z-10"
                                                                    }`}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            <span
                                                                className={`mt-2 ${index <= currentIndex
                                                                    ? "text-green-600 font-semibold"
                                                                    : "text-gray-500"
                                                                    }`}
                                                            >
                                                                {step}
                                                            </span>
                                                            {index < steps.length - 1 && (
                                                                <div
                                                                    className={`absolute top-4 w-full h-[2px] ${index < currentIndex
                                                                        ? "bg-green-500"
                                                                        : "bg-gray-300"
                                                                        }`}
                                                                    style={{
                                                                        left: `${(index / (steps.length - 1)) * 100}%`,
                                                                        width: `${100 / (steps.length - 1)}%`,
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center w-full">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 bg-red-500 border-red-500 text-white">
                                                        ✖
                                                    </div>
                                                    <span className="mt-2 text-red-600 font-semibold">
                                                        {cancelledStep}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 font-semibold text-[18px] text-center text-gray-500">
                                            {explainText}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedOrderId(null)}
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

export default UserDb;
