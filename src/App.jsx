// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/BannerFeatures';
import FP from './components/FP';
import About from './components/About';
import Footer from './components/Footer';
import Login from './components/Login';
import Rejister from './components/Rejister';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';
import Testimonals from './components/Testimonals';
import Contact from './components/Conatact';
// Admin
import AdminPanel from './components/admin/AdminPanel';
import ManageOrders from './components/admin/ManageOrders';
import ManageReviews from './components/admin/ManageReviews';
import ManageUsers from './components/admin/ManageUsers';
import ManageProducts from './components/admin/ManageProducts';
import ManageTestimonals from './components/admin/ManageTestimonals';
import Dashboard from './components/admin/Dashboard';
import { UserContext } from './context/UserContext';
import UserDb from './components/User/UserDb';
import Checkout from './components/Checkout';

function ScrollToTopWrapper({ handleAddToCart, isCartOpen, setIsCartOpen, setCartItems, cartItems, getcarts }) {
  const location = useLocation();
  const fpRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const refreshFeatured = () => {
    fpRef.current?.fetchProducts?.();
    const bc = new BroadcastChannel('products');
    bc.postMessage('products-updated');
    bc.close();
  };

  return (
    <>
      <Navbar cartCount={cartItems?.length} setCartItems={setCartItems} onCartClick={() => setIsCartOpen(true)} />

      <Routes>
        <Route path="/prods" element={<Products ref={fpRef} onAddToCart={handleAddToCart} setIsCartOpen={setIsCartOpen} />} />
        <Route path="/product/:id" element={<ProductDetail ref={fpRef} onAddToCart={handleAddToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rejister" element={<Rejister />} />
        <Route path="/contact" element={<Contact />}/>

        <Route
          path="/"
          element={
            <>
              <Banner />
              <FP ref={fpRef} onAddToCart={handleAddToCart} setIsCartOpen={setIsCartOpen} />
              <About />
              <Testimonals />
            </>
          }
        />
        <Route
          path="/:id"
          element={
            <>
              <Banner />
              <FP ref={fpRef} onAddToCart={handleAddToCart} setIsCartOpen={setIsCartOpen} />
              <About />
              <Testimonals />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              setCartItems={setCartItems}
              clearCart={() => setCartItems([])}
            />
          }
        />

        {/* User */}
        <Route path='/db/:id' element={<UserDb setCartItems={setCartItems} />}></Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ManageProducts refreshFeatured={refreshFeatured} />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="testimonals" element={<ManageTestimonals />} />
        </Route>
      </Routes>

      <Footer />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        setCartItems={setCartItems}
        getcarts={getcarts}
      />
    </>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(UserContext);

  const getAllCarts = async () => {
    let res = await fetch(`http://localhost:5000/api/cart/user/${user._id}`, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (Array.isArray(data.carts)) {
      setCartItems(data.carts);
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (user && user._id) getAllCarts();
  }, []);

  useEffect(() => {
  const checkServerBoot = async () => {
    if (!user || !user._id) return; // Only run if user is logged in

    try {
      const res = await fetch("http://localhost:5000/server-boot");
      const data = await res.json();
      const currentBootId = String(data.bootId);
      const previousBootId = localStorage.getItem("serverBootId");

      // If there’s no previous ID, store it (first login) — no logout
      if (!previousBootId) {
        localStorage.setItem("serverBootId", currentBootId);
        return;
      }

      // If they differ, it means server was restarted
      if (previousBootId !== currentBootId) {
        alert("⚠️ Server restarted. You have been logged out.");
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (err) {
      console.error("🛑 Server boot check failed:", err);
    }
  };

  // Delay check slightly to ensure login process has updated localStorage
  const timeout = setTimeout(() => checkServerBoot(), 500);
  return () => clearTimeout(timeout);
}, [user]);


  const handleAddToCart = async (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => (p.productId?._id || p._id) === product._id);
      if (existing) {
        return prev.map((p) =>
          (p.productId?._id || p._id) === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...prev, { productId: product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);

    if (user) {
      try {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            productId: product._id,
            quantity: 1,
          }),
        });
      } catch (err) {
        console.error('Failed to store cart in DB:', err);
      }
    }
    getAllCarts();
  };

  return (
    <Router>
      <ScrollToTopWrapper
        cartItems={cartItems}
        setCartItems={setCartItems}
        handleAddToCart={handleAddToCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        user={user}
        getcarts={getAllCarts}
      />
    </Router>
  );
}

export default App;
