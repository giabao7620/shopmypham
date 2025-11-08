import { useState, useEffect } from "react";
import BearWatcher from "../../components/BearPasswordPeek";
import Header from "../../components/Header";
import { useApp } from "../../context/AppContext";
import "../Home/home.css";

// CSS cho animation
const modalStyles = `
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

export default function Login() {
  const { navigateTo, login } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeField, setActiveField] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ type: '', message: '' });

  useEffect(() => {
    window.navigateToRegister = () => navigateTo('register');
    return () => {
      delete window.navigateToRegister;
    };
  }, [navigateTo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Login data:', formData);
    
    try {
      const response = await fetch('http://localhost:8888/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setModalData({ type: 'success', message: 'Đăng nhập thành công!' });
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          login(data.user || { name: formData.email }, data.token);
        }, 1500);
      } else {
        setModalData({ type: 'error', message: data.message || 'Đăng nhập thất bại!' });
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      console.error('Error details:', error);
      setModalData({ type: 'error', message: 'Lỗi kết nối server!' });
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };
  
  return (
    <div>
      <Header />
      <div className="register-container">
      <BearWatcher activeField={activeField} />
      
      <div className="register-form">
        <h2 className="register-title">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField('')}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField('')}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="form-button">
            Đăng nhập
          </button>
        </form>

        <p className="form-footer">
          Chưa có tài khoản?{" "}
          <button 
            type="button" 
            onClick={() => window.navigateToRegister && window.navigateToRegister()}
            style={{ background: 'none', border: 'none', color: '#ec4899', fontWeight: '500', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Đăng ký
          </button>
        </p>
      </div>

      {/* Modal thông báo */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>
              {modalData.type === 'success' ? '✅' : '❌'}
            </div>
            <h3 style={{ 
              color: modalData.type === 'success' ? '#4caf50' : '#f44336', 
              marginBottom: '15px', 
              fontSize: '20px' 
            }}>
              {modalData.type === 'success' ? 'Thành công!' : 'Lỗi!'}
            </h3>
            <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
              {modalData.message}
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}