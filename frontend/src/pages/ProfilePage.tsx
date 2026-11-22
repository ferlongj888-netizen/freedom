import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="auth-page">
      <div className="auth-card profile-card">
        <p className="eyebrow">Личный кабинет</p>
        <h1>Привет, {user.name}!</h1>
        <p className="profile-email">{user.email}</p>

        <div className="profile-links">
          <Link className="profile-link" to="/cart">
            <span>Корзина</span>
            <strong>0</strong>
          </Link>
        </div>

        <button type="button" className="reset-button" onClick={logout}>
          Выйти
        </button>
      </div>
    </main>
  );
}