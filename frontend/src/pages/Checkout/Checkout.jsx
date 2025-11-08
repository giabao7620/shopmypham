import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./checkout.css";
import "../Home/home.css";

export default function Checkout() {
  const { user, cart, setCart } = useApp();
  
  // Debug user state
  console.log('Checkout - User from context:', user);
  console.log('Checkout - Cart from context:', cart);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    email: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách tỉnh thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận huyện khi chọn tỉnh
  const handleProvinceChange = async (provinceCode) => {
    setCustomerInfo({...customerInfo, city: provinceCode, district: ''});
    setDistricts([]);
    
    if (provinceCode) {
      setLoading(true);
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách quận huyện:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateShippingFee = () => {
    const cityCode = customerInfo.city;
    // Mã tỉnh thành phố lớn
    const majorCities = ['79', '01', '48']; // TP.HCM, Hà Nội, Đà Nẵng
    const largeCities = ['31', '92']; // Hải Phòng, Cần Thơ
    
    if (cityCode === '79') {
      return 30000; // TP.HCM
    } else if (majorCities.includes(cityCode) || largeCities.includes(cityCode)) {
      return 50000; // Các thành phố lớn
    } else {
      return 80000; // Tỉnh khác
    }
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = calculateShippingFee();
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    console.log('User state:', user);
    console.log('User ID:', user?._id);
    
    // if (!user || !user._id) {
    //   alert('Vui lòng đăng nhập để đặt hàng');
    //   // Tạm thời bỏ qua để test
    //   // return;
    // }
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.district) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    
    // Lấy tên tỉnh và quận để lưu vào đơn hàng
    const selectedProvince = provinces.find(p => p.code === customerInfo.city);
    const selectedDistrict = districts.find(d => d.code === customerInfo.district);
    
    const fullCustomerInfo = {
      ...customerInfo,
      cityName: selectedProvince?.name || '',
      districtName: selectedDistrict?.name || ''
    };
    
    const orderData = {
      userId: user?._id || '60d5ecb74b24a1234567890a', // Test ID
      items: cart.items,
      customerInfo: fullCustomerInfo,
      subtotal,
      shippingFee,
      total
    };
    
    console.log('Order data:', orderData);
    
    try {
      const res = await fetch("http://localhost:8888/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok) {
        alert(data.message);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        setCart({ items: [] });
        // Xóa giỏ hàng trong database nếu user đã đăng nhập
        if (user && user._id) {
          try {
            await fetch(`http://localhost:5000/api/cart/clear/${user._id}`, {
              method: 'DELETE'
            });
          } catch (error) {
            console.error('Lỗi khi xóa giỏ hàng:', error);
          }
        }
      } else {
        alert(`Lỗi: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Lỗi kết nối server');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <Header />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
          <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>💳</div>
            <p style={{ fontSize: '18px', color: '#666' }}>Không có sản phẩm để thanh toán</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}>💳 Thanh toán</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
            {/* Customer Information */}
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Thông tin giao hàng</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Họ và tên *</label>
                  <input 
                    type="text" 
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Số điện thoại *</label>
                  <input 
                    type="tel" 
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Email</label>
                  <input 
                    type="email" 
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    placeholder="Nhập email (tùy chọn)"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Tỉnh/Thành phố *</label>
                  <select 
                    value={customerInfo.city}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Quận/Huyện *</label>
                  <select
                    value={customerInfo.district}
                    onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    disabled={!customerInfo.city || loading}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {loading && <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>Đang tải...</p>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '5px' }}>Địa chỉ cụ thể *</label>
                  <textarea 
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }}
                    placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường...)"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Đơn hàng của bạn</h3>
              
              <div style={{ marginBottom: '20px' }}>
                {cart.items.map((item) => (
                  <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 5px 0' }}>{item.product.name}</p>
                      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Số lượng: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{(item.product.price * item.quantity).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#666' }}>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#666' }}>Phí vận chuyển:</span>
                  <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: '#e91e63' }}>{total.toLocaleString()}đ</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '15px', backgroundColor: '#e91e63', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500'
                }}
              >
                Xác nhận đặt hàng
              </button>
              
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: '1.4' }}>
                  <strong>Phí vận chuyển:</strong><br/>
                  • TP.HCM: 30,000đ<br/>
                  • Hà Nội, Đà Nẵng, Hải Phòng: 50,000đ<br/>
                  • Tỉnh khác: 80,000đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
