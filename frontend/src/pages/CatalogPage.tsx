import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import type { Product } from "../types/product";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Новая коллекция</p>
          <h1>Одежда с характером</h1>
        </div>
        <p className="product-count">{products.length} товаров</p>
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "50px" }}>Загрузка товаров из базы данных...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>Ошибка: {error}</p>}

      {!loading && !error && (
        <section className="products-grid" aria-label="Каталог товаров">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <span className="product-style">{product.style}</span>
                <span className="image-placeholder">F</span>
              </div>

              <div className="product-info">
                <p className="product-brand">{product.brand}</p>
                <h2>{product.name}</h2>
                <p className="product-description">{product.description}</p>
                
                <div className="product-bottom">
                  <strong className="product-price">
                    {Number(product.price).toLocaleString("ru-RU")} ₽
                  </strong>
                  <button className="add-button" type="button">
                    В корзину
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}