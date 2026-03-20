import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, CartItem, Order, Review, ProductFilters, Coupon } from '../types';
import { products as mockProducts, reviews as mockReviews, coupons as mockCoupons, mockUser, mockAdmin, mockOrders } from '../data/mockData';

interface AppState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  
  // Products State
  products: Product[];
  reviews: Review[];
  filters: ProductFilters;
  
  // Cart State
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  
  // Orders State
  orders: Order[];
  
  // UI State
  currentPage: string;
  searchQuery: string;
  isLoading: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  
  // Coupons
  coupons: Coupon[];
  
  // Actions - User
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  updateProfile: (updates: Partial<User>) => void;
  
  // Actions - Products
  setFilters: (filters: ProductFilters) => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Actions - Cart
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; tax: number; shipping: number; discount: number; total: number };
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Actions - Orders
  createOrder: (paymentMethod: 'card' | 'paypal' | 'cod', shippingAddress: any) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Actions - Reviews
  addReview: (productId: string, rating: number, comment: string) => void;
  getProductReviews: (productId: string) => Review[];
  
  // Actions - UI
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
  
  // Admin Actions
  getAllUsers: () => User[];
  getAnalytics: () => {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    recentOrders: Order[];
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      users: [mockUser, mockAdmin],
      products: mockProducts,
      reviews: mockReviews,
      filters: {},
      cart: [],
      appliedCoupon: null,
      orders: mockOrders,
      currentPage: 'home',
      searchQuery: '',
      isLoading: false,
      notification: null,
      coupons: mockCoupons,

      // User Actions
      login: (email: string, password: string) => {
        const { users } = get();
        const user = users.find(u => u.email === email);
        if (user && password.length >= 6) {
          set({ user, isAuthenticated: true });
          get().showNotification('success', `Welcome back, ${user.name}!`);
          return true;
        }
        get().showNotification('error', 'Invalid email or password');
        return false;
      },

      loginWithGoogle: () => {
        set({ user: mockUser, isAuthenticated: true });
        get().showNotification('success', `Welcome back, ${mockUser.name}!`);
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, cart: [], appliedCoupon: null });
        get().showNotification('info', 'You have been logged out');
      },

      register: (name: string, email: string, password: string) => {
        const { users } = get();
        if (users.find(u => u.email === email)) {
          get().showNotification('error', 'Email already registered');
          return false;
        }
        if (password.length < 6) {
          get().showNotification('error', 'Password must be at least 6 characters');
          return false;
        }
        const newUser: User = {
          id: `u${Date.now()}`,
          email,
          name,
          role: 'user',
          addresses: [],
          createdAt: new Date(),
        };
        set({ users: [...users, newUser], user: newUser, isAuthenticated: true });
        get().showNotification('success', 'Account created successfully!');
        return true;
      },

      updateProfile: (updates) => {
        const { user, users } = get();
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        set({
          user: updatedUser,
          users: users.map(u => u.id === user.id ? updatedUser : u),
        });
        get().showNotification('success', 'Profile updated successfully');
      },

      // Product Actions
      setFilters: (filters) => set({ filters }),

      getFilteredProducts: () => {
        const { products, filters, searchQuery } = get();
        let filtered = [...products];

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags.some(t => t.toLowerCase().includes(query))
          );
        }

        if (filters.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= filters.maxPrice!);
        }

        if (filters.rating) {
          filtered = filtered.filter(p => p.rating >= filters.rating!);
        }

        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            case 'newest':
              filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              break;
          }
        }

        return filtered;
      },

      getProductById: (id) => get().products.find(p => p.id === id),

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `p${Date.now()}`,
          createdAt: new Date(),
        };
        set({ products: [...get().products, newProduct] });
        get().showNotification('success', 'Product added successfully');
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, ...updates } : p),
        });
        get().showNotification('success', 'Product updated successfully');
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) });
        get().showNotification('success', 'Product deleted successfully');
      },

      // Cart Actions
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
        get().showNotification('success', `${product.name} added to cart`);
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) });
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      getCartTotal: () => {
        const { cart, appliedCoupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        
        let discount = 0;
        if (appliedCoupon) {
          if (appliedCoupon.type === 'percentage') {
            discount = Math.min(subtotal * (appliedCoupon.value / 100), appliedCoupon.maxDiscount || Infinity);
          } else {
            discount = appliedCoupon.value;
          }
        }
        
        const total = subtotal + tax + shipping - discount;
        return { subtotal, tax, shipping, discount, total };
      },

      applyCoupon: (code) => {
        const { coupons, cart, appliedCoupon } = get();
        if (appliedCoupon) {
          get().showNotification('error', 'A coupon is already applied');
          return false;
        }
        
        const coupon = coupons.find(c => c.code === code.toUpperCase());
        if (!coupon) {
          get().showNotification('error', 'Invalid coupon code');
          return false;
        }
        
        if (new Date(coupon.expiresAt) < new Date()) {
          get().showNotification('error', 'Coupon has expired');
          return false;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        if (subtotal < coupon.minOrder) {
          get().showNotification('error', `Minimum order of $${coupon.minOrder} required`);
          return false;
        }
        
        set({ appliedCoupon: coupon });
        get().showNotification('success', 'Coupon applied successfully!');
        return true;
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      // Order Actions
      createOrder: (paymentMethod, shippingAddress) => {
        const { user, cart, getCartTotal } = get();
        const { subtotal, tax, shipping, discount, total } = getCartTotal();
        
        const newOrder: Order = {
          id: `ord${Date.now()}`,
          userId: user?.id || 'guest',
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.images[0],
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress,
          paymentMethod,
          status: 'confirmed',
          subtotal,
          tax,
          shipping,
          discount,
          total,
          createdAt: new Date(),
          trackingNumber: `TRK${Date.now()}`,
        };
        
        set({ orders: [...get().orders, newOrder], cart: [], appliedCoupon: null });
        get().showNotification('success', 'Order placed successfully!');
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(o =>
            o.id === orderId
              ? { ...o, status, deliveredAt: status === 'delivered' ? new Date() : o.deliveredAt }
              : o
          ),
        });
        get().showNotification('success', `Order status updated to ${status}`);
      },

      // Review Actions
      addReview: (productId, rating, comment) => {
        const { user } = get();
        if (!user) {
          get().showNotification('error', 'Please login to write a review');
          return;
        }
        
        const newReview: Review = {
          id: `r${Date.now()}`,
          productId,
          userId: user.id,
          userName: user.name,
          rating,
          comment,
          createdAt: new Date(),
          helpful: 0,
        };
        
        set({ reviews: [...get().reviews, newReview] });
        
        // Update product rating
        const productReviews = get().reviews.filter(r => r.productId === productId);
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        get().updateProduct(productId, { rating: avgRating, reviewCount: productReviews.length });
        
        get().showNotification('success', 'Review submitted successfully');
      },

      getProductReviews: (productId) => {
        return get().reviews.filter(r => r.productId === productId);
      },

      // UI Actions
      setCurrentPage: (page) => set({ currentPage: page }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      showNotification: (type, message) => {
        set({ notification: { type, message } });
        setTimeout(() => {
          set({ notification: null });
        }, 3000);
      },

      clearNotification: () => set({ notification: null }),

      // Admin Actions
      getAllUsers: () => get().users,

      getAnalytics: () => {
        const { orders, users, products } = get();
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        return {
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalProducts: products.length,
          recentOrders: orders.slice(-10).reverse(),
        };
      },
    }),
    {
      name: 'shopverse-storage',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        appliedCoupon: state.appliedCoupon,
        orders: state.orders,
      }),
    }
  )
);
