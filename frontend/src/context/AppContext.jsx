import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);
  const [cart, setCart] = useState({ items: [] });

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const navigateToSonLi = () => {
    setCurrentPage('sonli');
  };

  const navigateToAdmin = () => {
    setCurrentPage('adminDashboard');
  };

  const login = (userData = null) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentPage('home');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
  };

  const viewProduct = (productId) => {
    console.log('viewProduct called with:', productId);
    setSelectedProductId(productId);
    setCurrentPage('productDetail');
  };

  const viewCategoryProducts = (categoryName, subcategory = null) => {
    setSelectedCategory({ categoryName, subcategory });
    setCurrentPage('categoryProducts');
  };

  const viewSubcategoryProducts = (subcatId, subcatName) => {
    setSubcategoryId(subcatId);
    setSubcategoryName(subcatName);
    setCurrentPage('subcategoryProducts');
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.product._id === product._id);
      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map(item => 
            item.product._id === product._id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return {
          ...prevCart,
          items: [...prevCart.items, { product, quantity }]
        };
      }
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.product._id !== productId)
    }));
  };

  return (
    <AppContext.Provider value={{ currentPage, navigateTo, navigateToSonLi, navigateToAdmin, login, logout, isLoggedIn, user, selectedProductId, viewProduct, selectedCategory, viewCategoryProducts, subcategoryId, subcategoryName, viewSubcategoryProducts, cart, addToCart, updateCartQuantity, removeFromCart }}>
      {children}
    </AppContext.Provider>
  );
};