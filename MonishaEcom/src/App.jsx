import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Products from './pages/products/Products';
import ProductDetails from './pages/products/ProductDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Cart from './pages/cart/Cart';
import Wishlist from './pages/wishlist/Wishlist';
import Checkout from './pages/checkout/Checkout';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import MyOrders from './pages/orders/MyOrders';
import OrderDetails from './pages/orders/OrderDetails';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/my-orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-dvh text-center p-4">
            <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
            <p className="text-text-secondary mb-6">Page not found</p>
            <a href="/" className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-hover transition-colors">Go Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
