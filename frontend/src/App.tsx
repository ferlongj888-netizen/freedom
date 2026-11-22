import { useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';

type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  style: string;
  price: number;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Женский пуловер',
    brand: 'ZHRILL',
    description: 'Из 100% хлопка, с V-образным вырезом',
    style: 'Casual',
    price: 10500,
  },
  {
    id: 2,
    name: 'Женские джоггеры',
    brand: 'ZHRILL',
    description: 'Из высококачественного хлопка и тенселя, с карманами',
    style: 'Casual',
    price: 15300,
  },
  {
    id: 3,
    name: 'Женское худи Loose fit',
    brand: 'Lacoste',
    description: 'Из хлопка и полиэстера',
    style: 'Casual',
    price: 12800,
  },
  {
    id: 4,
    name: 'Джинсы багги',
    brand: 'XANTRAK',
    description: 'Из высококачественного денима',
    style: 'Y2K',
    price: 8900,
  },
  {
    id: 5,
    name: 'Шорты',
    brand: 'FEELZ',
    description: 'Из плотного денима, с карманами',
    style: 'Y2K',
    price: 5400,
  },
  {
    id: 6,
    name: 'Топ Crop FLZ',
    brand: 'FEELZ',
    description: 'Из хлопка и эластана',
    style: 'Y2K',
    price: 2600,
  },
];

const sizes = ['XS', 'S', 'M'];

function formatPrice(price: number) {
  return `${price.toLocaleString('ru-RU')} ₽`;
}

function CatalogPage({ onAddToCart }: { onAddToCart: () => void }) {
  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(16000);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});

  const brands = [...new Set(products.map((product) => product.brand))];

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const searchableText =
        `${product.name} ${product.brand} ${product.description} ${product.style}`.toLowerCase();

      const matchesSearch = searchableText.includes(searchText);
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [search, selectedBrands, maxPrice]);

  function toggleBrand(brand: string) {
    setSelectedBrands((currentBrands) =>
      currentBrands.includes(brand)
        ? currentBrands.filter((item) => item !== brand)
        : [...currentBrands, brand],
    );
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Новая коллекция</p>
          <h1>Одежда с характером</h1>
        </div>
        <p className="product-count">{filteredProducts.length} товаров</p>
      </div>

      <div className="catalog-layout">
        <aside className="filters">
          <h2>Найти своё</h2>

          <label className="search-label" htmlFor="product-search">
            Поиск по товарам
          </label>
          <input
            id="product-search"
            className="search-input"
            type="search"
            placeholder="Например, деним"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="filter-section">
            <h3>Бренд</h3>
            {brands.map((brand) => (
              <label className="checkbox-row" key={brand}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <label className="price-label" htmlFor="price-range">
              Максимальная цена
            </label>
            <strong className="price-value">{formatPrice(maxPrice)}</strong>
            <input
              id="price-range"
              className="price-range"
              type="range"
              min="2600"
              max="16000"
              step="100"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
          </div>

          <button
            className="reset-button"
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedBrands([]);
              setMaxPrice(16000);
            }}
          >
            Сбросить фильтры
          </button>
        </aside>

        <section className="products-grid" aria-label="Каталог товаров">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <span className="product-style">{product.style}</span>
                  <span className="image-placeholder">F</span>
                </div>

                <div className="product-info">
                  <p className="product-brand">{product.brand}</p>
                  <h2>{product.name}</h2>
                  <p className="product-description">{product.description}</p>

                  <div className="size-picker">
                    <span>Размер:</span>
                    {sizes.map((size) => (
                      <button
                        className={`size-button ${
                          selectedSizes[product.id] === size ? 'selected' : ''
                        }`}
                        key={size}
                        type="button"
                        aria-pressed={selectedSizes[product.id] === size}
                        onClick={() =>
                          setSelectedSizes((current) => ({
                            ...current,
                            [product.id]: size,
                          }))
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="product-bottom">
                    <strong className="product-price">
                      {formatPrice(product.price)}
                    </strong>
                    <button
                      className="add-button"
                      type="button"
                      disabled={!selectedSizes[product.id]}
                      onClick={onAddToCart}
                    >
                      {selectedSizes[product.id] ? 'В корзину' : 'Выберите размер'}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h2>Ничего не найдено</h2>
              <p>Попробуйте изменить поисковый запрос или фильтры.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CartPage({ itemCount }: { itemCount: number }) {
  return (
    <main className="page cart-page">
      <p className="eyebrow">Ваш выбор</p>
      <h1>Корзина</h1>
      <p>
        Добавлено товаров: <strong>{itemCount}</strong>
      </p>
      <Link className="back-link" to="/">
        Вернуться в каталог
      </Link>
    </main>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">
          freedom<span>.</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Каталог</Link>
          <Link to="/cart">Корзина ({cartCount})</Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <CatalogPage onAddToCart={() => setCartCount((count) => count + 1)} />
          }
        />
        <Route path="/cart" element={<CartPage itemCount={cartCount} />} />
        <Route path="*" element={<CatalogPage onAddToCart={() => setCartCount((count) => count + 1)} />} />
      </Routes>
    </>
  );
}

export default App;