import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Hoje from './pages/Hoje';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Navbar fixa no topo */}
        <Navbar />
        
        {/* Conteúdo principal com padding */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hoje" element={<Hoje />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
