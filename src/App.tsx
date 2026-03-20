import { useState } from 'react';
import { useStore } from './store/useStore';
import { Product } from './types';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';

// Pages
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
import CategoriesPage from './components/pages/CategoriesPage';
import OrdersPage from './components/pages/OrdersPage';
import ProfilePage from './components/pages/ProfilePage';

// Product
import ProductDetail from './components/product/ProductDetail';

// Cart & Checkout
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import OrderConfirmation from './components/checkout/OrderConfirmation';

// Auth
import LoginPage from './components/auth/LoginPage';

// Admin
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { currentPage, setCurrentPage } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    setCurrentPage('products');
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleOrderComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    setCurrentPage('order-confirmation');
  };

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onViewProduct={handleViewProduct} />;
      
      case 'products':
        return <ProductsPage onViewProduct={handleViewProduct} />;
      
      case 'categories':
        return <CategoriesPage />;
      
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={handleBackFromProduct} />
        ) : (
          <ProductsPage onViewProduct={handleViewProduct} />
        );
      
      case 'cart':
        return <Cart onCheckout={handleCheckout} />;
      
      case 'checkout':
        return <Checkout onOrderComplete={handleOrderComplete} />;
      
      case 'order-confirmation':
        return completedOrderId ? (
          <OrderConfirmation orderId={completedOrderId} />
        ) : (
          <HomePage onViewProduct={handleViewProduct} />
        );
      
      case 'orders':
        return <OrdersPage />;
      
      case 'profile':
        return <ProfilePage />;
      
      case 'login':
        return <LoginPage />;
      
      case 'admin':
        return <AdminDashboard />;
      
      default:
        return <HomePage onViewProduct={handleViewProduct} />;
    }
  };

  // Login page has a different layout (no header/footer)
  if (currentPage === 'login') {
    return (
      <>
        <Notification />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Notification />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
