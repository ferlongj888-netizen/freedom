import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { fetchOrders, type Order } from "../api/orders";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchMyCart = useCartStore((state) => state.fetchMyCart);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyCart();
      fetchOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, fetchMyCart]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="page">
      <div className="page-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="eyebrow">Личный кабинет</p>
          <h1>Привет, {user.name}!</h1>
          <p className="profile-email" style={{ color: "#77717e", marginTop: "5px" }}>{user.email}</p>
        </div>
        <button type="button" className="reset-button" onClick={logout} style={{ width: "auto", margin: 0 }}>
          Выйти
        </button>
      </div>

      <h2 style={{ marginTop: "40px", marginBottom: "20px", fontFamily: "'Lilita One', cursive", fontWeight: 400, fontSize: "32px" }}>
        Мои заказы
      </h2>

      {loading && <p>Загрузка заказов...</p>}
      
      {!loading && orders.length === 0 && (
        <p>У вас пока нет заказов. <Link to="/" style={{ color: "#8055c7", fontWeight: "bold" }}>Перейти в каталог</Link></p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <strong>Заказ #{order.id}</strong>
                <span className="order-date" style={{ marginLeft: "15px", color: "#77717e", fontSize: "14px" }}>
                  {new Date(order.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <span className={`order-status status-${order.status}`}>
                {order.status === "created" ? "Оформлен" : order.status}
              </span>
            </div>
            
            <div className="order-items" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
              {order.items.map((item) => (
                <div key={item.id} className="order-item-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                  <span>{item.product_name} (Размер: {item.size})</span>
                  <span>{item.quantity} шт.</span>
                  <span>{Number(item.price_at_moment).toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
            </div>
            
            <div className="order-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #e6e1eb", fontSize: "18px" }}>
              <span>Итого:</span>
              <strong>{Number(order.total_price).toLocaleString("ru-RU")} ₽</strong>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}