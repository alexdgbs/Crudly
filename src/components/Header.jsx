import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
         
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight">
              Crudly
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`py-2 px-1 text-sm font-medium transition-colors border-b-2 ${
                isActive("/") ? "border-white text-white" : "border-transparent"
              }`}
            >
              Inicio
            </Link>
            
            {token ? (
              <>
                {role === 'admin' && (
                  <Link 
                    to="/dashboard" 
                    className={`py-2 px-1 text-sm font-medium transition-colors border-b-2 ${
                      isActive("/dashboard") ? "border-white text-white" : "border-transparent"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="ml-4 text-white py-2 px-4 border-t border-b hover:border-gray-400 text-xs uppercase font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className= "ml-4 text-white py-2 px-4 border-t border-b hover:border-gray-400 text-xs uppercase font-medium transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-60" : "max-h-0"
        }`}>
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              to="/" 
              className={`px-4 py-2 text-xs uppercase font-medium ${
                isActive("/") 
                  ? "bg-gray-700 text-white" 
                  : "text-white hover:bg-gray-700 hover:bg-opacity-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            {token ? (
              <>
                {role === 'admin' && (
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 text-xs uppercase font-medium ${
                      isActive("/dashboard") 
                        ? "bg-gray-700 text-white" 
                        : "text-white hover:bg-gray-700 hover:bg-opacity-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-xs border-b font-medium uppercase hover:bg-gray-700 transition-colors text-left w-full"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 text-xs uppercase font-medium text-white border-b hover:bg-gray-600 transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;