import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);
  const { theme, handleToggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "All Books", path: "/books" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const adminLinks = [{ name: "Dashboard", path: "/dashboard" }];

  const getNavLinks = () => {
    if (user?.role === "admin") {
      return [...publicLinks, ...adminLinks];
    }
    return publicLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav
      className={`shadow-md sticky top-0 z-50 transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className={`text-2xl font-bold transition-colors ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          >
            HUBLibrary
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors ${
                    theme === "dark"
                      ? `text-gray-300 hover:text-blue-400 ${
                          isActive ? "text-blue-400 font-semibold" : ""
                        }`
                      : `text-gray-700 hover:text-blue-600 ${
                          isActive ? "text-blue-600 font-semibold" : ""
                        }`
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleToggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <MdLightMode className="w-5 h-5" />
              ) : (
                <MdDarkMode className="w-5 h-5" />
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-t transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? `text-gray-300 hover:bg-gray-800 ${
                          isActive
                            ? "bg-blue-900/20 text-blue-400 font-semibold"
                            : ""
                        }`
                      : `text-gray-700 hover:bg-gray-100 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : ""
                        }`
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div
              className={`pt-3 border-t flex items-center justify-between ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <button
                onClick={handleToggleTheme}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {theme === "dark" ? (
                  <>
                    <MdLightMode className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MdDarkMode className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
