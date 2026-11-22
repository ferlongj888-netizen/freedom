import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка регистрации");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Добро пожаловать</p>
        <h1>Регистрация</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Имя
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться?" required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Пароль
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="add-button auth-submit" type="submit">Создать аккаунт</button>
        </form>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
}