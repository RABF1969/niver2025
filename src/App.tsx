import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Hoje from "./pages/Hoje";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "./lib/supabase";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [user, setUser] = useState<any>(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Gerenciar tema (dark/light)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Monitorar sessão do Supabase
  useEffect(() => {
    // pega sessão inicial
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // escuta login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Wrapper de rota protegida
   */
  const RotaProtegida = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        {/* Navbar fixa */}
        {user && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

        {/* Conteúdo principal com padding-top para não ficar escondido */}
        <main className="flex-grow pt-20">
          <Routes>
            <Route
              path="/"
              element={
                <RotaProtegida>
                  <Dashboard />
                </RotaProtegida>
              }
            />
            <Route
              path="/hoje"
              element={
                <RotaProtegida>
                  <Hoje />
                </RotaProtegida>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* ToastContainer para mensagens */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </Router>
  );
}

export default App;
