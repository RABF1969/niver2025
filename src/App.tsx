import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Hoje from "./pages/Hoje";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Carregar preferência salva no localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  // Aplicar a classe dark no <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Conteúdo principal */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hoje" element={<Hoje />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
