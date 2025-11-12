import React, { useEffect, useState } from 'react';

const ManageTestimonals = () => {
  const [testimonals, settestimonals] = useState([]);

  useEffect(() => {
    const fetchTestimonals = () => {
      fetch('http://localhost:5000/api/testimonals')
        .then((res) => res.json())
        .then((data) => settestimonals(data))
        .catch((err) => console.error('Failed to fetch testimonals:', err));
    };

    fetchTestimonals(); // initial fetch
    const interval = setInterval(fetchTestimonals, 2000); // poll every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const handleDeleteTestimonals = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/testimonals/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete testimonal');

      settestimonals((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  return (
    <div className="pt-12 px-4">
      <h2 className="text-2xl text-center font-bold text-[#9f6b4a] mb-4">Manage Testimonals</h2>

      {testimonals.length === 0 ? (
        <p className='text-center'>No testimonals found.</p>
      ) : (
        testimonals.map((t) => (
          <div
            key={t._id}
            className="mb-4 border border-gray-300 rounded-lg p-4 shadow bg-white flex gap-4 items-center justify-between"
          >
            <p>
              <span className="font-semibold">{t.name}, {t.city}:</span> {t.message}
            </p>
            <button
              onClick={() => handleDeleteTestimonals(t._id)}
              className="text-red-600 cursor-pointer text-xl hover:scale-125 transition-transform"
            >
              🗑
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageTestimonals;
