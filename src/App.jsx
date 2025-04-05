import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiringItems, setHiringItems] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSearchFocused] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/items");
      const itemsData = Array.isArray(response.data) ? response.data : [];
      setItems(itemsData);
      const uniqueCategories = Array.from(
        new Set(itemsData.map((item) => item.category?.name).filter(Boolean))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error al obtener los items:", error);
      setError("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };
  const handleContratar = (id) => {
    if (hiringItems.includes(id)) return;
    setHiringItems((prev) => [...prev, id]);
    setTimeout(() => {
      const removeHiringItem = (itemId) => itemId !== id;
      setHiringItems((prev) => prev.filter(removeHiringItem));
      setPopupMessage("¡Servicio contratado con éxito!");
      setTimeout(() => {
        setPopupMessage("");
      }, 3000);
    }, 2000);
  };

  const filteredItems = items
    .filter((item) =>
      selectedCategory ? item.category?.name === selectedCategory : true
    )
    .filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="mt-4 text-sky-700 font-medium text-xs uppercase">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-center text-gray-800 text-xs uppercase font-medium mb-1">¡Error!</p>
          <p className="text-center text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={fetchItems}
            className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-md transition-colors duration-200 font-medium text-xs uppercase"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Pop-up de notificación */}
      {popupMessage && (
        <div className="uppercase text-xs fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black shadow-lg p-6 w-80 text-center">
            <p className="text-white font-medium">{popupMessage}</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-15"></div>
        </div>
      )}

      {/* Header Section */}
      <section className="bg-gray-900 text-white py-16 px-4 relative">
        <div className="absolute inset-0 bg-blue-900 opacity-10 pattern-grid"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-6 tracking-tight uppercase">
            Servicios Profesionales
          </h1>
          <p className="mb-8 text-sm font-bold md:text-sm text-gray-400 uppercase">
            Descubre nuestra amplia gama de servicios especializados
          </p>
          
          {/* Improved Search Input */}
          <div className={`relative max-w-xl mx-auto transition-all duration-300 ${isSearchFocused ? 'scale-101' : ''}`}>
          <input
         type="text"
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       className="w-full py-3 px-5 bg-gray-800 rounded-full text-white pl-12 text-xs transition-all duration-300 outline-none shadow-md"
            />


            <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-colors duration-300 ${
               'text-white'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/*Categorias*/}
      <section className="py-4 px-4 sticky top-0 bg-white z-10 shadow-md">
        <div className="container mx-auto">
          <div className="overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex items-center gap-2 md:gap-3 px-1 pb-1" style={{ minWidth: 'max-content' }}>
              <div className="flex items-center gap-2 md:gap-3 md:mx-auto">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`font-medium text-sm md:text-sm px-4 md:px-5 py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === ""
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`font-medium text-sm md:text-sm px-4 md:px-5 py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                      selectedCategory === category
                        ? "bg-gray-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Servicios/Items*/}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 p-4 border-b">
            <h2 className="text-md font-bold text-gray-800 uppercase">
              {selectedCategory || "Todos los servicios"}
              {searchTerm && <span className="text-red-500 text-sm"> - "{searchTerm}"</span>}
            </h2>
            <div className="text-sm text-black border-b px-3 py-1 ">
              {filteredItems.length} {filteredItems.length === 1 ? "servicio" : "servicios"}
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id || `item-${Math.random()}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gray-800 text-white p-4 relative">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md md:text-lg font-bold truncate">
                        {item.name || ""}
                      </h3>
                      {item.category?.name && (
                        <span className="inline-block bg-blue-900 text-blue-100 text-xs px-2 py-1 rounded-full font-medium ml-2 shadow-sm">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-400"></div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {item.description || "Sin descripción disponible"}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded flex items-center">
                        <span className="mr-1">${item.price || "0"}</span>
                        <span className="text-xs text-gray-500">/hora</span>
                      </span>
                      <button
                        onClick={() => handleContratar(item._id)}
                        disabled={hiringItems.includes(item._id)}
                        className="bg-red-400 hover:bg-red-500 text-white font-medium rounded-md px-4 py-2 text-xs transition-colors duration-200 flex items-center gap-2"
                      >
                        {hiringItems.includes(item._id) ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                            Contratando...
                          </>
                        ) : (
                          "Contratar"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="px-6">
              <h3 className="text-sm uppercase font-bold text-gray-800 mb-2">No hay servicios disponibles</h3>
                <p className="text-gray-600 mb-1">No encontramos resultados para tu búsqueda.</p>
                 <p className="text-gray-500 mb-6">Intenta con otra categoría o término de búsqueda.</p>
           </div>

              {(selectedCategory || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchTerm("");
                  }}
                  className="text-xs uppercase bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 font-medium"
                >
                  Ver todos los servicios
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;