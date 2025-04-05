import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "https://server-test-oqdo.onrender.com";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("items");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/items");
      const itemsData = response.data.map(item => ({
        ...item,
        category:
          typeof item.category === "object" && item.category !== null
            ? item.category.name
            : item.category
      }));
      setItems(itemsData);
    } catch (error) {
      console.error("Error al obtener los items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/items", newItem);
      const newItemWithCategory = {
        ...response.data,
        category: newItem.category
      };
      setItems([...items, newItemWithCategory]);
      setNewItem({ name: "", description: "", price: "", category: "" });
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error al crear el item:", error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categories.some((category) => category.name === newCategory)) {
      try {
        const response = await axios.post("/api/categories", { name: newCategory });
        setCategories([...categories, response.data]);
        setNewCategory("");
        setSidebarOpen(false);
      } catch (error) {
        console.error("Error al crear la categoría:", error);
      }
    }
  };

  const handleStartEditing = (item) => {
    setEditingItem(item);
  };

  const handleUpdateCategory = async (category) => {
    try {
      const oldName = category.oldName;
      const response = await axios.put(`/api/categories/${category._id}`, {
        name: category.name,
      });
      const updatedCategories = categories.map((c) =>
        c._id === category._id ? response.data : c
      );
      setCategories(updatedCategories);
      const updatedItems = items.map((item) => {
        if (item.category === oldName) {
          return { ...item, category: response.data.name };
        }
        return item;
      });
      setItems(updatedItems);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    }
  };

  const handleUpdate = async (item) => {
    try {
      const updatedItem = {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category
      };
      const response = await axios.put(`/api/items/${item._id}`, updatedItem);
      const updatedItemFromResponse = {
        ...response.data,
        category: item.category
      };
      setItems(items.map((i) => (i._id === item._id ? updatedItemFromResponse : i)));
      setEditingItem(null);
    } catch (error) {
      console.error("Error al actualizar el item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error al eliminar el item:", error);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await axios.delete(`/api/categories/${category._id}`);
      setCategories(categories.filter((c) => c._id !== category._id));
      const updatedItems = items.map(item => {
        if (item.category === category.name) {
          return { ...item, category: null };
        }
        return item;
      });
      setItems(updatedItems);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const renderCategories = () => {
    if (categories.length === 0) {
      return (
        <div className="text-center p-8 md:p-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No hay categorías disponibles.</p>
          <p className="text-sm text-gray-400 mt-2">Crea una nueva categoría para comenzar.</p>
        </div>
      );
    }

    return categories.map((category) => (
      <li
        key={category._id}
        className="bg-white p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
      >
        {editingCategory && editingCategory._id === category._id ? (
          <input
            type="text"
            value={editingCategory.name}
            onChange={(e) =>
              setEditingCategory({ ...editingCategory, name: e.target.value })
            }
            className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-4 text-sm"
            autoFocus
          />
        ) : (
          <span className="text-gray-700 text-xs uppercase font-bold block mb-4">{category.name}</span>
        )}
        <div className="flex space-x-3">
          {editingCategory && editingCategory._id === category._id ? (
            <>
              <button
                onClick={() => handleUpdateCategory(editingCategory)}
                className="flex-1 hover:bg-gray-100 text-black px-4 py-2 border-b transition-colors duration-200 text-xs font-medium"
              >
                GUARDAR
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="flex-1 hover:bg-gray-100 text-black px-4 py-2 transition-colors duration-200 text-xs border-t font-medium"
              >
                CANCELAR
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingCategory({ ...category, oldName: category.name })}
                className="flex-1 hover:bg-gray-100 text-black px-4 py-2 border-b transition-colors duration-200 text-xs font-medium"
              >
              EDITAR
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="flex-1 bg-red-50 hover:bg-red-100 border-t text-red-600 px-4 py-2 transition-colors duration-200 text-xs font-medium"
              >
                ELIMINAR
              </button>
            </>
          )}
        </div>
      </li>
    ));
  };

  const renderCategoryOptions = () => {
    return categories.map((category) => (
      <option key={category._id} value={category.name}>
        {category.name}
      </option>
    ));
  };

  const renderItemsGrid = () => {
    if (isLoading) {
      return (
        <div className="col-span-full flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="col-span-full text-center p-8 md:p-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 uppercase text-xs">No hay servicios disponibles.</p>
          <p className="text-xs uppercase text-gray-400 mt-2">Crea un nuevo servicio para comenzar.</p>
        </div>
      );
    }

    return items.map((item) => (
      <div
        key={item._id}
        className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        {editingItem && editingItem._id === item._id ? (
          <div className="p-4 md:p-6">
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              className="w-full p-3 mb-3 border-b border-gray-200 text-xs"
              placeholder="NOMBRE"
              autoFocus
            />
            <textarea
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description: e.target.value,
                })
              }
              className="w-full p-3 mb-3 border border-gray-200 min-h-24 text-xs"
              placeholder="DESCRIPCIÓN"
            />
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="relative flex-1">
              <span className="absolute left-3 top-5 transform -translate-y-1/2 text-xs">$</span>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: e.target.value })
                  }
                  className="w-full p-3 pl-6 border border-gray-200 text-xs"
                  placeholder="PRECIO"
                />
              </div>
              <select
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="flex-1 p-3 border-b border-gray-200 bg-white text-xs uppercase"
              >
                <option value="">Sin categoría</option>
                {renderCategoryOptions()}
              </select>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleUpdate(editingItem)}
                className="flex-1 text-black hover:bg-gray-100 px-6 py-2 border-b transition-colors duration-200 text-xs font-medium"
              >
                GUARDAR
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 hover:bg-gray-100 text-black px-6 py-2 border-t transition-colors duration-200 text-xs font-medium"
              >
                CANCELAR
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 p-3">
              <span className="inline-block px-3 py-1 bg-white text-gray-600 text-xs font-medium rounded-full shadow-sm">
                {item.category || "Sin categoría"}
              </span>
            </div>
            <div className="p-4 md:p-6">
              <h4 className="text-md font-bold text-gray-700 mb-3">{item.name}</h4>
              <p className="text-gray-600 text-sm mb-4 min-h-16">{item.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 font-bold text-sm">${parseFloat(item.price).toFixed(2)}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartEditing(item)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-10">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
              DASHBOARD
            </h2>
          </div>
          <div className="bg-white rounded-full p-1 shadow-sm w-full md:w-auto">
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setActiveTab("items");
                  setSidebarOpen(false);
                }}
                className={`px-4 md:px-6 py-2 rounded-full text-xs uppercase font-bold transition-colors duration-200 flex-1 md:flex-none text-center ${
                  activeTab === "items"
                    ? "bg-gray-800 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                Items
              </button>
              <button
                onClick={() => {
                  setActiveTab("categories");
                  setSidebarOpen(false);
                }}
                className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors duration-200 flex-1 md:flex-none text-center ${
                  activeTab === "categories"
                    ? "bg-gray-800 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                Categorías
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-8">
          <div className={`xl:col-span-1 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="xl:sticky xl:top-8">
              <div className="bg-white border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                  <h3 className="font-bold text-xs">
                    {activeTab === "items" ? "NUEVO SERVICIO" : "NUEVA CATEGORÍA"}
                  </h3>
                  <button 
                    className="md:hidden text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {activeTab === "items" ? (
                  <form onSubmit={handleCreateItem} className="p-4 md:p-6">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="TRABAJO"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                        className="w-full p-3 border-b border-gray-200 text-xs"
                      />
                      <textarea
                        placeholder="DESCRIPCIÓN"
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({ ...newItem, description: e.target.value })
                        }
                        required
                        className="w-full p-3 border border-gray-200 text-xs min-h-24"
                      />
                      <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-800">$</span>
                        <input
                          type="number"
                          placeholder="PRECIO POR HORA"
                          value={newItem.price}
                          onChange={(e) =>
                            setNewItem({ ...newItem, price: e.target.value })
                          }
                          required
                          className="w-full p-3 pl-6 border border-gray-200 text-xs"
                        />
                      </div>
                      <select
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        required
                        className="w-full p-3 border-b border-gray-200 text-xs font-semibold uppercase bg-white"
                      >
                        <option value="">Seleccionar categoría</option>
                        {renderCategoryOptions()}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="text-xs uppercase w-full mt-6 text-black px-6 py-3 border-b hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                      CREAR SERVICIO
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateCategory} className="p-4 md:p-6">
                    <input
                      type="text"
                      placeholder="Nombre de la categoría"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                      className="w-full p-3 border-b border-gray-200 uppercase text-xs "
                    />
                    <button
                      type="submit"
                      className="text-xs uppercase w-full mt-6 text-black px-6 py-3 border-b hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                      Crear Categoría
                    </button>
                  </form>
                )}
              </div>
              
              {activeTab === "items" && (
                <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xs uppercase border-b">Estadísticas</h3>
                    <span className="text-xs bg-blue-100 text-sky-800 px-2 py-1 font-medium">Resumen</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white p-4 transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs uppercase border-t font-medium text-gray-600">Items</p>
                      </div>
                      <p className="text-md font-bold text-gray-700">{items.length}</p>
                      <p className="text-xs text-gray-400 mt-2">24 horas</p>
                    </div>
                    <div className="bg-white p-4 transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs uppercase border-t font-medium text-gray-600">Categorías</p>
                      </div>
                      <p className="text-md font-bold text-gray-700">{categories.length}</p>
                      <p className="text-xs text-gray-400 mt-2">Total activo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="xl:col-span-3">
            <div className="fixed bottom-6 right-6 md:hidden z-10">
              <button
                onClick={() => setSidebarOpen(true)}
                className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200"
                aria-label={activeTab === "items" ? "Agregar Item" : "Agregar Categoría"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {activeTab === "items" ? (
              <>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-lg uppercase md:text-xl font-bold text-gray-700">Lista de Items</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {renderItemsGrid()}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl uppercase font-bold text-gray-700">Lista de Categorías</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {renderCategories()}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;