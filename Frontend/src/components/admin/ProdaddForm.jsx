import React, { useState } from 'react';

const ProdaddForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    sale: false,
    salePercent: '',
    featured: false,
    topSelling: false,
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, images: [...files] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    for (let key in formData) {
      if (key === 'images') {
        formData.images.forEach((file) => form.append('images', file));
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Product added successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          sale: false,
          salePercent: '',
          featured: false,
          topSelling: false,
          images: [],
        });
      } else {
        alert(result.error || '❌ Failed to add product.');
      }
    } catch (err) {
      console.error('Product upload error:', err);
      alert('⚠️ Something went wrong.');
    }
  };

  const calculateSalePrice = () => {
    const price = parseFloat(formData.price);
    const percent = parseFloat(formData.salePercent);
    if (!formData.sale || isNaN(price) || isNaN(percent)) return '';
    return (price - (price * percent / 100)).toFixed(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded mb-12 shadow max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#9f6b4a]">Add New Product</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g. Peshawari Chappal"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Detailed description..."
          required
        ></textarea>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Price (₨)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g. 2499"
          required
        />
      </div>

      {/* Sale & Sale Percentage */}
      <div className="mb-4 flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="sale"
            checked={formData.sale}
            onChange={handleChange}
          />
          On Sale?
        </label>

        {formData.sale && (
          <>
            <input
              type="number"
              name="salePercent"
              value={formData.salePercent}
              onChange={handleChange}
              className="p-2 border rounded w-24"
              placeholder="% Off"
              min="1"
              max="99"
              required
            />
            <p className="text-green-700 text-sm">
              Final Price: ₨ {calculateSalePrice()}
            </p>
          </>
        )}
      </div>

      {/* Checkboxes */}
      <div className="mb-4 flex gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured
        </label>
      </div>
        
      {/* Image Upload */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Upload Images (multiple)</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          onChange={handleChange}
          multiple
          className="w-full cursor-pointer"
        />

        {/* Image Previews */}
        {formData.images.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Selected Images:</p>
            <div className="flex flex-wrap gap-3">
              {Array.from(formData.images).map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-20 h-20 object-cover rounded border border-gray-300 shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-[#9f6b4a] cursor-pointer text-white px-4 py-2 rounded hover:bg-amber-700 transition"
      >
        Submit Product
      </button>
    </form>
  );
};

export default ProdaddForm;
