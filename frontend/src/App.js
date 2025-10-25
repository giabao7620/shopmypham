import { AppProvider, useApp } from "./context/AppContext";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/Product/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
// import SonLi from "./pages/SonLi/SonLi";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CategoryProducts from "./pages/Category/CategoryProducts";
import SubcategoryProducts from "./pages/Subcategory/SubcategoryProducts";
import AllProducts from "./pages/AllProducts/AllProducts";

function AppContent() {
  const { currentPage, selectedProductId } = useApp();

  console.log("Current page:", currentPage, "Selected product:", selectedProductId);

  switch (currentPage) {
    case "home":
      return <Home />;

    case "productDetail":
      return <ProductDetail productId={selectedProductId} />;

    case "login":
      return <Login />;

    case "register":
      return <Register />;

    case "cart":
      return <Cart />;

    case "checkout":
      return <Checkout />;

    // case "sonli":
    //   return <SonLi />;

    case "adminDashboard":
      return <AdminDashboard />;

    case "categoryProducts":
      return <CategoryProducts />;

    case "subcategoryProducts":
      return <SubcategoryProducts />;

    case "allProducts":
      return <AllProducts />;

    default:
      return <Home />; // fallback
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
