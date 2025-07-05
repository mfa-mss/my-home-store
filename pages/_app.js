import "@/styles/globals.css";
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </CartProvider>
  );
}
