import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./checkout.css";
import "../Home/home.css";

export default function Checkout() {
  const { user, cart } = useApp();

  const handleCheckout = async () => {
    const res = await fetch("http://localhost:8888/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, items: cart.items }),
    });
    const data = await res.json();
    alert(data.message);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <Header />
        <div className="checkout-page">
          <p className="empty-cart">Không có sản phẩm để thanh toán</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="checkout-page">
      <h2>💳 Thanh toán</h2>
      {cart.items.map((item) => (
        <div key={item.product._id} className="checkout-item">
          <p>{item.product.name} × {item.quantity}</p>
          <p>{(item.product.price * item.quantity).toLocaleString()}đ</p>
        </div>
      ))}
      <div className="checkout-total">
        <h3>
          Tổng tiền:{" "}
          {cart.items
            .reduce((sum, i) => sum + i.product.price * i.quantity, 0)
            .toLocaleString()}đ
        </h3>
      </div>
      <button className="btn" onClick={handleCheckout}>
        Xác nhận đặt hàng
      </button>
      </div>
    </div>
  );
}
