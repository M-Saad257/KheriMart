import React, { useState } from 'react';

const TestimonalForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/testimonals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newTestimonal = await res.json();
        onAdd(newTestimonal); // Update parent slider dynamically
        setFormData({ name: '', city: '', message: '' });
        setSuccess(true);
      } else {
        alert('Error submitting testimonal');
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10 mb-10">
      <h2 className="text-2xl font-bold text-[#9f6b4a] mb-4 text-center">Write a Testimonal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="Your City"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded h-28"
        />
        <button
          type="submit"
          className="bg-[#9f6b4a] cursor-pointer hover:bg-[#7f5235] text-white px-6 py-2 rounded w-full"
        >
          Submit
        </button>
        {success && <p className="text-green-600 text-center">Thanks for your feedback!</p>}
      </form>
    </div>
  );
};

export default TestimonalForm;
