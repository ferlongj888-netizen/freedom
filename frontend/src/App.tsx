import { Link, Route, Routes } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import "./App.css";

function App() {
  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">
          freedom<span>.</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Каталог</Link>
          <Link to="/cart">Корзина</Link>
        </nav>
      </header>

      <Routes>
        {/* Вот она, та самая строчка! */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<CatalogPage />} />
      </Routes>
    </>
  );
}

export default App;