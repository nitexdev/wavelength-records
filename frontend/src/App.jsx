import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Success from "./pages/Success";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/records/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-6xl mx-auto px-6 text-sm text-[var(--color-gold-dim)]">
              &copy; {new Date().getFullYear()} Wavelength Records. Vinyl only, always.
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
