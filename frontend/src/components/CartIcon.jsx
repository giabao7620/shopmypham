import { useApp } from "../context/AppContext";
import "./CartIcon.css";

export default function CartIcon() {
  const { cart, navigateTo } = useApp();
  
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button className="cart-icon" onClick={() => navigateTo('cart')}>
      🛒
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </button>
  );
}