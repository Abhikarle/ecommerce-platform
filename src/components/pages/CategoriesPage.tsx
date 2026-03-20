import { useStore } from '../../store/useStore';
import { categories } from '../../data/mockData';

export default function CategoriesPage() {
  const { setFilters, setCurrentPage } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setFilters({ category: categoryName });
    setCurrentPage('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our wide selection of products across all categories. From electronics to fashion,
          we have everything you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">{category.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm">{category.productCount} products</p>
              
              <div className="mt-4 flex items-center justify-center text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Browse Category
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Featured Category Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large Category Card */}
          <button
            onClick={() => handleCategoryClick('Electronics')}
            className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl overflow-hidden h-64 text-left"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-8">
              <span className="text-5xl mb-4">📱</span>
              <h3 className="text-2xl font-bold text-white mb-2">Electronics</h3>
              <p className="text-white/80 mb-4">
                Latest gadgets, laptops, phones, and more
              </p>
              <span className="text-white font-medium flex items-center gap-2">
                Shop Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </button>

          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => handleCategoryClick('Fashion')}
              className="group relative bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl overflow-hidden h-[120px] text-left"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative h-full flex items-center p-6 gap-6">
                <span className="text-4xl">👕</span>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Fashion</h3>
                  <p className="text-white/80 text-sm">Trending styles for everyone</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleCategoryClick('Home & Living')}
              className="group relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl overflow-hidden h-[120px] text-left"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative h-full flex items-center p-6 gap-6">
                <span className="text-4xl">🏠</span>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Home & Living</h3>
                  <p className="text-white/80 text-sm">Make your house a home</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
