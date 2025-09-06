// src/components/Navbar.tsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg dark:bg-gray-800 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png" // 🔥 Coloque sua logo em public/logo.png
              alt="Logo Alfabiz"
              className="h-10 w-auto"
            />
          </Link>

          {/* Menu */}
          <div className="flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold"
                  : "hover:text-blue-300"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/hoje"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold"
                  : "hover:text-blue-300"
              }
            >
              Aniversariantes de Hoje
            </NavLink>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
