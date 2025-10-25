import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./cart.css";
import "../Home/home.css";

export default function Cart() {
  const { cart, navigateTo, updateCartQuantity, removeFromCart } = useApp();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h3>Giỏ hàng trống</h3>
          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
          <button className="btn continue-shopping-btn" onClick={() => navigateTo('home')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <Header />
      <div className="cart-page">
      <div className="cart-header">
        <h2>🛒 Giỏ hàng của bạn</h2>
      </div>

      {cart.items.map((item) => (
        <div key={item.product._id} className="cart-item">
          <div className="cart-item-image">
            {item.product.image ? (
              <img src={item.product.image} alt={item.product.name} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '24px' }}>
                🧴
              </div>
            )}
          </div>
          
          <div className="cart-item-info">
            <div className="cart-item-name">{item.product.name}</div>
            <div className="cart-item-price">{item.product.price.toLocaleString()}đ</div>
            
            <div className="cart-item-controls">
              <span>Số lượng:</span>
              <button 
                className="quantity-btn" 
                onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <div className="quantity-display">{item.quantity}</div>
              <button 
                className="quantity-btn" 
                onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
              >
                +
              </button>
              <div>= {(item.product.price * item.quantity).toLocaleString()}đ</div>
              <button 
                className="remove-btn" 
                onClick={() => removeFromCart(item.product._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div className="cart-total">
          Tổng cộng: {total.toLocaleString()}đ
        </div>
        
        <div className="cart-actions">
          <button className="btn continue-shopping-btn" onClick={() => navigateTo('home')}>
            Tiếp tục mua sắm
          </button>
          <button className="btn checkout-btn" onClick={() => navigateTo('checkout')}>
            Tiến hành thanh toán
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
