import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TestimonalForm from './TestimonalForm';

const Testimonals = () => {
  const [testimonals, setTestimonals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTestimonials = () => {
      fetch('http://localhost:5000/api/testimonals')
        .then((res) => res.json())
        .then((data) => setTestimonals(data))
        .catch((err) => console.error('❌ Error fetching testimonials:', err));
    };

    fetchTestimonials(); // Initial fetch
    const interval = setInterval(fetchTestimonials, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);


  const handleAddTestimonal = (newOne) => {
    setTestimonals((prev) => [newOne, ...prev]);
    setShowForm(false);
  };

  return (
    <section className="bg-gray-100 px-4 text-center">
      <div className="py-6">
        <button
          className="cursor-pointer bg-[#9f6b4a] hover:bg-[#7f5235] text-white px-6 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close Form' : 'Write a Review'}
        </button>
      </div>

      {showForm && <TestimonalForm onAdd={handleAddTestimonal} />}

      <h2 className="text-3xl font-bold text-[#9f6b4a] mb-6">What Our Customers Say</h2>

      <div className="max-w-5xl mx-auto pb-14 relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={-100}
          slidesPerView={1.6}
          centeredSlides={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="testimonial-swiper"
        >
          {testimonals.map((item, idx) => (
            <SwiperSlide key={idx} >
              <div className="bg-white h-full p-6 rounded shadow text-left mx-4 transition-transform duration-300 ease-in-out hover:scale-105">
                <p className="text-gray-700 italic">“{item.message}”</p>
                <p className="mt-4 font-bold text-[#9f6b4a]">— {item.name}, {item.city}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonals;
