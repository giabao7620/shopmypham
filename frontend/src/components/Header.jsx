import { useApp } from "../context/AppContext";
import CartIcon from "./CartIcon";

export default function Header() {
  const { user, logout, navigateTo } = useApp();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <span className="pink">Beauty</span>
            <span className="gray">Store</span>
          </h1>

          <div className="auth-buttons">
            {user ? (
              <>
                <CartIcon />
                <span className="user-name">Xin chào, {user.name}</span>
                <button onClick={logout} className="btn logout-btn">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo("register")}
                  className="btn"
                >
                  Đăng ký
                </button>
                <button onClick={() => navigateTo("login")} className="btn">
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}