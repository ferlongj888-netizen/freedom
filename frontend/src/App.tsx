import { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import "./App.css";

function App() {
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const fetchMyCart = useCartStore((state) => state.fetchMyCart);

  useEffect(() => {
    if (user) {
      fetchMyCart();
    }
  }, [user, fetchMyCart]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">
          freedom<span>.</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Каталог</Link>
          <Link to="/cart">Корзина ({totalCount})</Link>
          {user ? (
            <Link to="/profile">{user.name}</Link>
          ) : (
            <Link to="/login">Вход</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<CatalogPage />} />
      </Routes>
    </>
  );
}

export default App;