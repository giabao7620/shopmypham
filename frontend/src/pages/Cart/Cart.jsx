import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./cart.css";
import "../Home/home.css";

export default function Cart() {
  const { cart, navigateTo, updateCartQuantity, removeFromCart } = useApp();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
          <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
            <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Giỏ hàng trống</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
            <button 
              onClick={() => navigateTo('home')}
              style={{
                padding: '12px 24px', backgroundColor: '#e91e63', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}
            >Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = subtotal - discountAmount;

  const applyDiscount = () => {
    if (discountCode === 'SAVE10') {
      setAppliedDiscount(10);
    } else if (discountCode === 'SAVE20') {
      setAppliedDiscount(20);
    } else {
      alert('Mã giảm giá không hợp lệ');
    }
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}>🛒 Giỏ hàng của bạn</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            {/* Cart Items */}
            <div>
              {cart.items.map((item) => (
                <div key={item.product._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  marginBottom: '15px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '20px'
                }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden' }}>
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '24px', backgroundColor: '#f0f0f0' }}>🧴</div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>{item.product.name}</h4>
                    <p style={{ fontSize: '16px', color: '#e91e63', fontWeight: 'bold', marginBottom: '15px' }}>{item.product.price.toLocaleString()}đ</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Số lượng:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{
                            width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd',
                            backgroundColor: item.quantity <= 1 ? '#f5f5f5' : 'white', cursor: 'pointer'
                          }}
                        >-</button>
                        <span style={{ fontSize: '16px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer' }}
                        >+</button>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>= {(item.product.price * item.quantity).toLocaleString()}đ</span>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        style={{
                          padding: '6px 12px', backgroundColor: '#ff4757', color: 'white',
                          border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                        }}
                      >Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Tóm tắt đơn hàng</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#666' }}>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#e91e63' }}>
                    <span>Giảm giá ({appliedDiscount}%):</span>
                    <span>-{discountAmount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: '#e91e63' }}>{total.toLocaleString()}đ</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Mã giảm giá:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                  <button 
                    onClick={applyDiscount}
                    style={{
                      padding: '8px 15px', backgroundColor: '#e91e63', color: 'white',
                      border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >Áp dụng</button>
                </div>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Thử: SAVE10 hoặc SAVE20</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => navigateTo('home')}
                  style={{
                    padding: '12px', backgroundColor: 'transparent', color: '#e91e63',
                    border: '1px solid #e91e63', borderRadius: '8px', cursor: 'pointer'
                  }}
                >Tiếp tục mua sắm</button>
                <button 
                  onClick={() => navigateTo('checkout')}
                  style={{
                    padding: '12px', backgroundColor: '#e91e63', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
                  }}
                >Tiến hành thanh toán</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
