// src/components/admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';

const ManageProducts = ({ refreshFeatured }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Fetch products failed:', err));
  }, []);

  const handleDeleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      title: product.title || '',
      price: product.price || '',
      discount: product.discount || '',
      salePrice: product.salePrice || '',
      sale: product.sale || false,
      featured: product.featured || false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => {
      const updated = { ...prev, [name]: value };
      const price = parseFloat(updated.price) || 0;
      const discount = parseFloat(updated.discount) || 0;
      updated.salePrice = Math.round(price * (100 - discount) / 100);
      return updated;
    });
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) throw new Error('Failed to update product');

      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditingProduct(null);

    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  return (
    <div className="p-4 pt-12">
      <h2 className="text-2xl text-center font-bold mb-6 text-[#9f6b4a]">Manage Products</h2>

      {/* 🖥️ Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#9f6b4a] text-white">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Discount%</th>
              <th className="py-3 px-4">Sale Price</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) =>
              editingProduct?._id === product._id ? (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <img src={product.images?.[0]} alt={product.title} className="w-20 h-20 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input name="title" value={editingProduct.title} onChange={handleInputChange} className="border rounded px-2 py-1" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input name="price" value={editingProduct.price} onChange={handleInputChange} className="border rounded px-2 py-1 w-16" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input name="discount" value={editingProduct.discount} onChange={handleInputChange} className="border rounded px-2 py-1 w-10" />
                  </td>
                  <td className="px-4 py-3 text-green-600 font-bold text-center">₨ {editingProduct.salePrice}</td>
                  <td className="px-4 py-3 text-center space-y-1">
                    <td className='flex flex-col text-left'>
                      <label className="block cursor-pointer">
                        <input type="checkbox" checked={editingProduct.sale} onChange={(e) => setEditingProduct((prev) => ({ ...prev, sale: e.target.checked, discount: 0 }))} />
                        <span className="ml-1">Sale</span>
                      </label>
                      <label className="block cursor-pointer mt-1">
                        <input type="checkbox" checked={editingProduct.featured} onChange={(e) => setEditingProduct((prev) => ({ ...prev, featured: e.target.checked }))} />
                        <span className="ml-1">Featured</span>
                      </label>
                    </td>
                    <button onClick={handleUpdateProduct} className="px-2 cursor-pointer py-1 bg-green-600 text-white rounded">Save</button>
                    <button onClick={() => setEditingProduct(null)} className="mt-1 cursor-pointer px-2 py-1 ml-1 bg-gray-500 text-white rounded">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-center">
                    <img src={product.images?.[0]} alt={product.title} className="w-20 h-20 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-center">{product.title}</td>
                  <td className="px-4 py-3 text-center">₨ {product.price}</td>
                  <td className="px-4 py-3 text-center">{product.discount || 0}%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold text-center">₨ {product.salePrice || product.price}</td>
                  <td className="flex relative top-6 px-4 py-3 text-center space-x-2">
                    <button onClick={() => handleEditClick(product)} className="px-3 cursor-pointer py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="px-3 cursor-pointer py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {products.map((product) =>
          editingProduct?._id === product._id ? (
            <div key={product._id} className="border rounded p-4 bg-white shadow">
              <div className="flex gap-4">
                <img src={product.images?.[0]} alt={product.title} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1 space-y-2">
                  <input name="title" value={editingProduct.title} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
                  <input name="price" value={editingProduct.price} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
                  <input name="discount" value={editingProduct.discount} onChange={handleInputChange} className="w-full border px-2 py-1 rounded" />
                  <p className="text-green-700 font-bold">Sale Price: ₨ {editingProduct.salePrice}</p>
                  <label>
                    <input type="checkbox" checked={editingProduct.sale} onChange={(e) => setEditingProduct((prev) => ({ ...prev, sale: e.target.checked }))} />
                    <span className="ml-1 mr-1.5">Sale</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={editingProduct.featured} onChange={(e) => setEditingProduct((prev) => ({ ...prev, featured: e.target.checked }))} />
                    <span className="ml-1">Featured</span>
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleUpdateProduct} className="cursor-pointer flex-1 px-3 py-1 bg-green-600 text-white rounded">Save</button>
                    <button onClick={() => setEditingProduct(null)} className="cursor-pointer flex-1 px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={product._id} className="border rounded p-4 bg-white shadow">
              <div className="flex gap-4">
                <img src={product.images?.[0]} alt={product.title} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{product.title}</h3>
                  <p>Price: ₨ {product.price}</p>
                  <p className="text-green-700 font-semibold">Sale: ₨ {product.salePrice || product.price}</p>
                  <p>Discount: {product.discount || 0}%</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditClick(product)} className="cursor-pointer flex-1 px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="cursor-pointer flex-1 px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
