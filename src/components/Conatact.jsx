import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "rik-20-3806",
        "template_g14nnjg",
        formData,
        "DaklfxMHkTJ3ZswYp"
      )
      .then(
        (result) => {
          console.log(result.text);
          setStatus("success");
          alert(`Dear ${formData.name}, Message sent successfully!`);
          setFormData({ name: "", email: "", query: "" }); // Reset after alert
        },
        (error) => {
          console.error(error.text);
          setStatus("error");
          alert(`Dear ${formData.name}, Failed to send message!`);
        }
      );
  };

  return (
    <div className="max-w-lg mt-20 mb-9 mx-auto p-8 bg-[#fdf9f5] border border-[#d4a373] rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#8b5e34] mb-6 text-center">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border border-[#d4a373] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a47148] placeholder-gray-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full border border-[#d4a373] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a47148] placeholder-gray-500"
        />
        <textarea
          name="query"
          value={formData.query}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows="4"
          className="w-full border border-[#d4a373] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a47148] placeholder-gray-500"
        ></textarea>
        <button
          type="submit"
          className="w-full cursor-pointer bg-[#a47148] text-white px-4 py-3 rounded-lg hover:bg-[#8b5e34] transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
