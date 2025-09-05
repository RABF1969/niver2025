import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Hoje from "./pages/Hoje";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hoje" element={<Hoje />} />
          </Routes>
        </main>
        {/* Toast container */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </div>
    </Router>
  );
}

export default App;
