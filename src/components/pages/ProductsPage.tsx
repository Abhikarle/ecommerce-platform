import { useStore } from '../../store/useStore';
import ProductCard from '../product/ProductCard';
import ProductFilters from '../product/ProductFilters';
import { Product } from '../../types';

interface ProductsPageProps {
  onViewProduct: (product: Product) => void;
}

export default function ProductsPage({ onViewProduct }: ProductsPageProps) {
  const { getFilteredProducts, searchQuery, filters } = useStore();
  const products = getFilteredProducts();

  const hasActiveFilters = searchQuery || Object.keys(filters).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {filters.category || 'All Products'}
        </h1>
        <p className="text-gray-600">
          {products.length} products found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <ProductFilters />

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters or search query'
                  : 'No products available at the moment'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => useStore.getState().setFilters({})}
                  className="text-indigo-600 font-medium hover:text-indigo-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
