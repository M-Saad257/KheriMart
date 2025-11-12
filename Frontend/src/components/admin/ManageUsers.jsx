import React, { useEffect, useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers(); // initial fetch
    const interval = setInterval(fetchUsers, 2000); // fetch every 2 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchUsers();
      } else {
        alert(result.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="p-4 pt-9 md:p-12">
      <h2 className="text-2xl font-bold text-[#9f6b4a] mb-4 text-center">
        Manage Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-600 text-center">No users found.</p>
      ) : (
        <>
          {/* 🟠 Table view for medium+ screens */}
          <div className="hidden md:block p-2 overflow-x-auto rounded-md">
            <table className="min-w-full bg-white border border-gray-300 text-sm md:text-base">
              <thead className="bg-[#f7ede2] text-[#9f6b4a]">
                <tr>
                  <th className="py-2 px-3 border text-left">Name</th>
                  <th className="py-2 px-3 border text-left">Email</th>
                  <th className="py-2 px-3 border text-left">Phone</th>
                  <th className="py-2 px-3 border text-left">City</th>
                  <th className="py-2 px-3 border text-left">Country</th>
                  <th className="py-2 px-3 border text-left">Address</th>
                  <th className="py-2 px-3 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 border break-words">{user.name}</td>
                    <td className="py-2 px-3 border break-words">{user.email}</td>
                    <td className="py-2 px-3 border break-words">{user.phone}</td>
                    <td className="py-2 px-3 border">{user.city}</td>
                    <td className="py-2 px-3 border">{user.country}</td>
                    <td className="py-2 px-3 border capitalize break-words">{user.address}</td>
                    <td className="py-2 px-3 border">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🟢 Card view for small screens */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border">
                <h3 className="text-lg font-semibold text-[#9f6b4a] mb-1">{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>City:</strong> {user.city}</p>
                <p><strong>Country:</strong> {user.country}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="mt-3 cursor-pointer bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
