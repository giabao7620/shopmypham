import { createContext, useContext, useState, useEffect } from 'react';

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

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(user);
          
          // Tải giỏ hàng từ database
          if (user._id) {
            try {
              const response = await fetch(`http://localhost:5000/api/cart/${user._id}`);
              const cartData = await response.json();
              setCart(cartData);
            } catch (error) {
              console.error('Lỗi khi tải giỏ hàng:', error);
              setCart({ items: [] });
            }
          }
        } catch (error) {
          console.error('Lỗi parse userData:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    };
    
    checkAuthToken();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const navigateToSonLi = () => {
    setCurrentPage('sonli');
  };

  const navigateToAdmin = () => {
    setCurrentPage('adminDashboard');
  };

  const login = async (userData = null, token = null) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    // Lưu token và userData vào localStorage
    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Tải giỏ hàng từ database khi đăng nhập
    if (userData && userData._id) {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userData._id}`);
        const cartData = await response.json();
        setCart(cartData);
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
        setCart({ items: [] });
      }
    }
    
    setCurrentPage('home');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCart({ items: [] }); // Xóa giỏ hàng khi đăng xuất
    
    // Xóa token và userData khỏi localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
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

  const addToCart = async (product, quantity = 1) => {
    // Cập nhật local state trước
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

    // Đồng bộ với database nếu user đã đăng nhập
    if (user && user._id) {
      try {
        await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            productId: product._id,
            quantity
          })
        });
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
      }
    }
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
    <AppContext.Provider value={{ currentPage, navigateTo, navigateToSonLi, navigateToAdmin, login, logout, isLoggedIn, user, selectedProductId, viewProduct, selectedCategory, viewCategoryProducts, subcategoryId, subcategoryName, viewSubcategoryProducts, cart, setCart, addToCart, updateCartQuantity, removeFromCart }}>
      {children}
    </AppContext.Provider>
  );
};