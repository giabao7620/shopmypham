import { useState, useEffect } from "react";
import BearWatcher from "../../components/BearPasswordPeek";
import Header from "../../components/Header";
import { useApp } from "../../context/AppContext";
import "../Home/home.css";

export default function Login() {
  const { navigateTo, login } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeField, setActiveField] = useState('');

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
        login(data.user || { name: formData.email });
      } else {
        alert(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Lỗi kết nối server!');
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
    </div>
    </div>
  );
}