import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { fetchProducts, type ProductFilters } from "../api/products";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    brand: "",
    max_price: 20000,
  });

  const navigate = useNavigate();

  const brands = ["ZHRILL", "Lacoste", "XANTRAK", "FEELZ"];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    fetchProducts({
      search: filters.search || undefined,
      brand: filters.brand || undefined,
      max_price: filters.max_price,
    })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters]);

  const handleReset = () => {
    setFilters({ search: "", brand: "", max_price: 20000 });
  };

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Найти своё</p>
          <h1>Поиск и фильтры</h1>
        </div>
        <p className="product-count">{products.length} товаров</p>
      </div>

      <div className="catalog-layout">
        <aside className="filters">
          <h2>Фильтры</h2>

          <label className="search-label">Поиск по названию</label>
          <input
            className="search-input"
            type="search"
            placeholder="Например, деним..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <div className="filter-section">
            <h3>Бренд</h3>
            {brands.map((brand) => (
              <label className="checkbox-row" key={brand}>
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => setFilters({ ...filters, brand })}
                />
                <span>{brand}</span>
              </label>
            ))}
            <label className="checkbox-row">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === ""}
                onChange={() => setFilters({ ...filters, brand: "" })}
              />
              <span>Все бренды</span>
            </label>
          </div>

          <div className="filter-section">
            <label className="price-label">Максимальная цена</label>
            <strong className="price-value">{Number(filters.max_price).toLocaleString("ru-RU")} ₽</strong>
            <input
              className="price-range"
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: Number(e.target.value) })}
            />
          </div>

          <button className="reset-button" type="button" onClick={handleReset}>
            Сбросить фильтры
          </button>
        </aside>

        <section className="products-grid">
          {loading && <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>Загрузка...</p>}
          
          {!loading && products.length === 0 && (
            <div className="empty-state">
              <h2>Ничего не найдено</h2>
              <p>Попробуйте изменить запрос или фильтры.</p>
            </div>
          )}

          {!loading && products.map((product) => (
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
                  <button className="add-button" onClick={() => navigate(`/product/${product.id}`)}>
                    Подробнее
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}