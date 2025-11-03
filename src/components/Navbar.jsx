import React, { useState, useEffect, useContext } from 'react';
import { FaShoppingCart, FaUserAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { UserContext } from '../context/UserContext';


const Navbar = ({ onCartClick, cartCount, setCartItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);


    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = React.useRef(null);
    const navigate = useNavigate();

    const handleGoToAdmin = () => {
        navigate('/admin/dashboard');
    };
    useEffect(() => {
        let interval;

        if (user && user._id) {
            const checkUserExists = () => {
                fetch(`http://localhost:5000/api/users/${user._id}`)
                    .then(res => {
                        if (res.status === 404) {
                            // User was deleted on the server
                            handleLogout();
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (!data || data.error) {
                            // If API returns an error or no user
                            handleLogout();
                        }
                    })
                    .catch(err => {
                        console.error("Error checking user:", err);
                    });
            };

            checkUserExists(); // initial check
            interval = setInterval(checkUserExists, 2000); // repeat every 2 seconds
        }

        return () => clearInterval(interval);
    }, [user]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleLogout = () => {
        setCartItems([]);
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);
        navigate('/');
        alert('User have been logged out!!')
    };
    const GotoUserDb = () => {
        navigate(`/db/${user._id}`)
    }


    return (
        <div className='fixed top-0 left-0 w-full shadow-md z-50 bg-[#9f6b4a]'>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

                {/* Left Links (Desktop Only) */}
                <div className="hidden md:flex gap-6 items-center text-white">
                    <Link
                        to="/"
                        className="relative font-bold hover:text-amber-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-amber-900 after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Home
                    </Link>
                    <Link
                        to="/prods"
                        className="relative font-bold hover:text-amber-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-amber-900 after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Products
                    </Link>
                    <Link
                        to="/contact"
                        className="relative font-bold hover:text-amber-900 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-amber-900 after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Contact
                    </Link>
                </div>

                {/* Logo */}
                <div
                    onDoubleClick={handleGoToAdmin}
                    className="text-center cursor-pointer md:mr-36 text-white font-bold text-xl tracking-widest flex items-center justify-center gap-2"
                >
                    <img src={Logo} alt="Logo" className='w-9 h-9' />
                    <span>KheriMart</span>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4 text-white relative">
                    {/* Cart Icon */}
                    <Link onClick={onCartClick} className="relative">
                        <FaShoppingCart className="text-xl hover:text-amber-900 transform hover:scale-150 transition duration-200" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile Section */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <FaUserAlt
                                alt="Profile"
                                className="text-xl hover:text-amber-900 cursor-pointer transform hover:scale-150 transition duration-200" onClick={() => setShowDropdown(prev => !prev)}
                            />
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded z-50 w-40">
                                    <div className="px-4 py-2 border-b text-sm font-medium">Hi, {user.name}</div>
                                    <button
                                        className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={GotoUserDb}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-xl cursor-pointer hover:text-amber-900 transform hover:scale-150 transition duration-200"
                        >
                            <FaUserAlt />
                        </Link>
                    )}

                    {/* Hamburger for Mobile */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-xl">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#9f6b4a] px-6 pb-4">
                    <ul className="flex flex-col gap-3 text-white font-semibold">
                        <li>
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-amber-400"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/prods"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-amber-400"
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className="block hover:text-amber-400"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
