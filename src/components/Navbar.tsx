import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + título */}
          <div className="flex items-center space-x-3">
            <img
              src="/vite.svg" // depois troca por logo da igreja
              alt="Logo"
              className="h-8 w-8"
            />
            <h1 className="text-lg font-bold tracking-wide">
              Aniversariantes Igreja Ramá
            </h1>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/hoje"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive("/hoje")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              Aniversariantes de Hoje
            </Link>

            {/* Botão dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-800 transition"
              title="Alternar tema"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Logout */}
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
