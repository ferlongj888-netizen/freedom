import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <main className="page cart-page">
        <h1>Корзина</h1>
        <p>Чтобы увидеть корзину, пожалуйста, <Link to="/login">войдите в аккаунт</Link>.</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page cart-page">
        <h1>Корзина пуста</h1>
        <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
        <Link className="back-link" to="/">Перейти в каталог</Link>
      </main>
    );
  }

  const totalSum = items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

  return (
    <main className="page cart-page">
      <h1>Корзина</h1>
      
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
               <span className="image-placeholder">F</span>
            </div>
            
            <div className="cart-item-info">
              <p className="product-brand">{item.product.brand}</p>
              <h2>{item.product.name}</h2>
              <p className="cart-item-size">Размер: {item.size}</p>
            </div>
            
            <div className="cart-item-quantity">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="cart-item-price">
              <strong>{Number(item.product.price).toLocaleString("ru-RU")} ₽</strong>
            </div>

            <button 
              className="cart-item-remove"
              onClick={() => removeItem(item.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Итого:</span>
          <strong>{totalSum.toLocaleString("ru-RU")} ₽</strong>
        </div>
        <Link className="add-button" to="/checkout">Оформить заказ</Link>
      </div>
    </main>
  );
}