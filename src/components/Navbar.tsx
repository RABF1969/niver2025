import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg dark:bg-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo Alfabiz"
              className="h-10 w-auto"
            />
          </Link>

          {/* Botão Hamburger no Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/hoje"
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-semibold" : "hover:text-blue-300"
              }
            >
              Aniversariantes de Hoje
            </NavLink>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Logout */}
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white">
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-900 px-4 pb-4 space-y-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-blue-300"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/hoje"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-blue-300"
          >
            Aniversariantes de Hoje
          </NavLink>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              setMenuOpen(false);
            }}
            className="flex items-center space-x-2 hover:text-blue-300"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
            <span>{darkMode ? "Modo Claro" : "Modo Escuro"}</span>
          </button>

          {/* Logout */}
          <button className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white">
            Sair
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
