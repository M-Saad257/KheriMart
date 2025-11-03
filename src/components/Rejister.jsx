import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

  // Country → City data
const countryCityData = {
  Pakistan: [
    "Faisalabad",
    "Gujrat",
    "Hyderabad",
    "Islamabad",
    "Karachi",
    "Karianwala",
    "Lahore",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot"
  ],
  India: [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Jaipur",
    "Kolkata",
    "Mumbai",
    "Pune"
  ],
  USA: [
    "Boston",
    "Chicago",
    "Dallas",
    "Houston",
    "Los Angeles",
    "Miami",
    "New York",
    "San Francisco",
    "Seattle"
  ],
  UK: [
    "Birmingham",
    "Bristol",
    "Glasgow",
    "Leeds",
    "Liverpool",
    "London",
    "Manchester",
    "Nottingham",
    "Sheffield"
  ],
  Canada: [
    "Calgary",
    "Edmonton",
    "Hamilton",
    "Montreal",
    "Ottawa",
    "Quebec City",
    "Toronto",
    "Vancouver",
    "Winnipeg"
  ],
  Australia: [
    "Adelaide",
    "Brisbane",
    "Canberra",
    "Darwin",
    "Gold Coast",
    "Hobart",
    "Melbourne",
    "Perth",
    "Sydney"
  ],
  UAE: [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain"
  ],
  "Saudi Arabia": [
    "Abha",
    "Dammam",
    "Jazan",
    "Jeddah",
    "Khobar",
    "Mecca",
    "Medina",
    "Riyadh",
    "Tabuk"
  ]
};

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        alert('User registered successfully!');
        navigate('/login');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7ede2] pt-20 pb-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#9f6b4a] mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Full name is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="col-span-2 md:col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 pr-10"
              placeholder="••••••••"
            />
            <span
              className="absolute right-3 top-9 text-gray-600 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="col-span-2 md:col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value =>
                  value === watch("password") || "Passwords do not match"
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 pr-10"
              placeholder="••••••••"
            />
            <span
              className="absolute right-3 top-9 text-gray-600 cursor-pointer"
              onClick={toggleConfirm}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>


          {/* Phone */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
              placeholder="03XXXXXXXXX"
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
              placeholder="House #123, Street #4, City"
            ></textarea>
            {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
          </div>

          {/* Country */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
              placeholder="Pakistan"
            />
            {errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
          </div>
          
          {/* City Dropdown */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              {...register("city", { required: "City is required" })}
              disabled={!countryCityData[selectedCountry]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500"
            >
              <option value="">Select City</option>
              {countryCityData[selectedCountry]?.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full cursor-pointer bg-[#9f6b4a] text-white py-2 rounded-lg hover:bg-[#80492f] font-semibold transition"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
