// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Hoje from "./pages/Hoje";
import Login from "./pages/Login";
// import Register from "./pages/Register"; // 🔥 pronto, mas desativado

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState<any>(null);

  // alternar dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // escutar sessão do supabase (login/logout)
  useEffect(() => {
    setSession(supabase.auth.getSession());

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Navbar só aparece se logado */}
        {session && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

        <main className="flex-grow pt-16">
          <Routes>
            {!session ? (
              <>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/hoje" element={<Hoje />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>

        {/* Footer em todas as páginas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
