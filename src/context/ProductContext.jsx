import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Listen for changes from other tabs
    const onStorageChange = (e) => {
      if (e.key === "products-updated") {
        fetchProducts();
      }
    };
    window.addEventListener("storage", onStorageChange);

    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Notify other tabs
  const notifyUpdate = () => {
    localStorage.setItem("products-updated", Date.now().toString());
  };

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, fetchProducts, notifyUpdate }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
