import { useState, useEffect } from 'react';
import { ShoppingCart, Filter, X, Plus, Minus, Heart } from 'lucide-react';
import { cartService, CartTotal } from '@/services/cart.service';
import type { MerchItem, MerchandiseCategory } from '@/types';
import { Layout } from '@/components/layout/Layout';
import { merchService } from '@/services/merch.service';

export default function MerchPage() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [cart, setCart] = useState<CartTotal | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<MerchandiseCategory | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Size selection modal
  const [selectedProduct, setSelectedProduct] = useState<MerchItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeQuantityValue, setSizeQuantityValue] = useState(1);

  // Quantity selection modal
  const [quantityProduct, setQuantityProduct] = useState<MerchItem | null>(null);
  const [quantitySize, setQuantitySize] = useState<string>('');
  const [quantityValue, setQuantityValue] = useState(1);

  // Notification
  const [notification, setNotification] = useState<string | null>(null);

  const categories: Array<{ value: MerchandiseCategory | 'all', label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'ROUPA', label: 'Roupa' },
    { value: 'CD', label: 'CDs' },
    { value: 'VINIL', label: 'Vinis' },
    { value: 'OUTRO', label: 'Outros' },
    { value: 'POSTER', label: 'Posters' },
    { value: 'ACESSORIO', label: 'Acessórios' }
  ];

  const minAvailablePrice = merchItems.length
    ? Math.min(...merchItems.map(item => item.price))
    : 0;
  const maxAvailablePrice = merchItems.length
    ? Math.max(...merchItems.map(item => item.price))
    : 0;

  useEffect(() => {
    if (merchItems.length && priceMin === null && priceMax === null) {
      setPriceMin(minAvailablePrice);
      setPriceMax(maxAvailablePrice);
    }
  }, [merchItems, minAvailablePrice, maxAvailablePrice, priceMin, priceMax]);

  const availableSizes = Array.from(
    new Set(
      merchItems
        .filter(item => item.category === 'ROUPA')
        .flatMap(item => item.variants?.map(variant => variant.size) || [])
    )
  );

  useEffect(() => {
    loadMerchandise();
    loadCart();
  }, []);

  const loadMerchandise = async () => {
    try {
      setLoading(true);
      const data = await merchService.getAll();
      setMerchItems(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Error loading merchandise:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const handleAddToCart = (product: MerchItem) => {
    if (product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setSelectedSize('');
      setSizeQuantityValue(1);
      setIsCartOpen(false);
    } else {
      openQuantityModal(product);
    }
  };

  const addToCartDirect = async (productId: number, size?: string, quantity: number = 1) => {
    try {
      await cartService.addItem(productId, quantity, size);
      await loadCart();
      setSelectedProduct(null);
      setSelectedSize('');
      setQuantityProduct(null);
      setQuantitySize('');
      setQuantityValue(1);
      setIsCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Erro ao adicionar ao carrinho');
    }
  };

  const confirmSizeSelection = () => {
    if (selectedProduct && selectedSize) {
      addToCartDirect(selectedProduct.id, selectedSize, sizeQuantityValue);
    }
  };
  const getSelectedVariantStock = () => {
    if (!selectedProduct || !selectedSize) return 0;
    const variant = selectedProduct.variants?.find(v => v.size === selectedSize);
    return variant ? variant.stock : 0;
  };


  const openQuantityModal = (product: MerchItem, size?: string) => {
    setQuantityProduct(product);
    setQuantitySize(size || '');
    setQuantityValue(1);
  };

  const confirmQuantitySelection = () => {
    if (quantityProduct) {
      addToCartDirect(quantityProduct.id, quantitySize || undefined, quantityValue);
    }
  };

  const getMaxQuantity = () => {
    if (!quantityProduct) return 1;
    if (quantityProduct.variants && quantityProduct.variants.length > 0 && quantitySize) {
      const variant = quantityProduct.variants.find(v => v.size === quantitySize);
      return variant ? variant.stock : quantityProduct.stock;
    }
    return quantityProduct.stock;
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await cartService.removeItem(itemId);
      } else {
        await cartService.updateItemQuantity(itemId, newQuantity);
      }
      await loadCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await cartService.removeItem(itemId);
      await loadCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      try {
        await cartService.clearCart();
        await loadCart();
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = () => {
    setNotification('Pagamento ainda indisponivel');
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const filteredMerch = merchItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPrice = (priceMin === null || item.price >= priceMin) &&
                         (priceMax === null || item.price <= priceMax);
    const matchesSize = sizeFilter === 'all'
      ? true
      : item.category === 'ROUPA' && item.variants?.some(variant => variant.size === sizeFilter);
    return matchesCategory && matchesPrice && matchesSize;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-coisa-gray/10 flex items-center justify-center">
          <div className="text-coisa-accent text-xl">A carregar produtos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-[#E8A598] text-black">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Loja Mansa</h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Leva um pedaço da Coisa Mansa contigo. T-shirts, álbuns, posters e muito mais.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-coisa-gray/10">
        <div className="container-custom">
          {/* Header with Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-coisa-black">Produtos</h2>
              
              <div className="flex items-center gap-4">
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-coisa-accent text-white rounded-lg hover:bg-coisa-accent-dark transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-coisa-accent font-semibold mb-3">Categorias</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.value
                            ? 'bg-coisa-accent text-white'
                            : 'bg-gray-100 text-coisa-black hover:bg-gray-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:pl-4 lg:border-l lg:border-gray-200">
                  <h3 className="text-coisa-accent font-semibold mb-3">Tamanhos (Roupa)</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSizeFilter('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        sizeFilter === 'all'
                          ? 'bg-coisa-accent text-white'
                          : 'bg-gray-100 text-coisa-black hover:bg-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSizeFilter(size)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          sizeFilter === size
                            ? 'bg-coisa-accent text-white'
                            : 'bg-gray-100 text-coisa-black hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-coisa-accent font-semibold mb-3">Preço</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-coisa-black/70">
                    <span>Min: {priceMin !== null ? priceMin.toFixed(2) : '0.00'}€</span>
                    <span>Max: {priceMax !== null ? priceMax.toFixed(2) : '0.00'}€</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={minAvailablePrice}
                      max={maxAvailablePrice}
                      step="0.01"
                      value={priceMin ?? minAvailablePrice}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setPriceMin(value);
                        if (priceMax !== null && value > priceMax) {
                          setPriceMax(value);
                        }
                      }}
                      className="w-full accent-coisa-accent"
                    />
                    <input
                      type="range"
                      min={minAvailablePrice}
                      max={maxAvailablePrice}
                      step="0.01"
                      value={priceMax ?? maxAvailablePrice}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setPriceMax(value);
                        if (priceMin !== null && value < priceMin) {
                          setPriceMin(value);
                        }
                      }}
                      className="w-full accent-coisa-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMerch.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group relative border border-gray-100"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl.startsWith('http') 
                        ? item.imageUrl 
                        : `http://localhost:3000${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-16 h-16" />
                    </div>
                  )}

                  <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#D9534F] transition-colors"
                    aria-label="Favorito"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  {/* Stock Badge */}
                  {item.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Esgotado
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-coisa-black mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* Category Badge */}
                  {item.category && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FCE9E7] text-[#D9534F] text-xs font-semibold mb-2">
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  )}

                  {/* Sizes */}
                  {item.variants && item.variants.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600">{item.variants.map(v => v.size).join(', ')}</p>
                    </div>
                  )}

                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-coisa-black">{item.price.toFixed(2)}€</span>
                      {item.stock > 0 && (
                        <span className="text-sm text-green-600">{item.stock} em stock</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        item.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-coisa-accent text-white hover:bg-coisa-accent-dark'
                      }`}
                    >
                      {item.stock === 0 ? 'Esgotado' : item.variants && item.variants.length > 0 ? 'Escolher Tamanho' : 'Adicionar ao Carrinho'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMerch.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </section>

      {/* Cart Popup (Bottom-Right) */}
      {isCartOpen && cart && (
        <div className="fixed bottom-3 right-3 z-50 w-[280px] sm:w-[320px] max-w-[92vw]">
          <div className="bg-white rounded-lg shadow-xl w-full max-h-[75vh] sm:max-h-[80vh] overflow-y-auto border border-gray-200">
            <div className="p-4 sm:p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-coisa-black">Carrinho de Compras</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-coisa-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notification */}
              {notification && (
                <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-sm sm:text-base font-medium text-center">{notification}</p>
                </div>
              )}

                {cart.items.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-gray-500">
                    <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p>O seu carrinho está vazio</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                      {cart.items.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex gap-3 sm:gap-4">
                            {/* Item Image */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded flex-shrink-0">
                              {item.merchandise.imageUrl ? (
                                <img
                                  src={item.merchandise.imageUrl.startsWith('http') 
                                    ? item.merchandise.imageUrl 
                                    : `http://localhost:3000${item.merchandise.imageUrl}`}
                                  alt={item.merchandise.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Item Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-coisa-black mb-1 text-sm sm:text-base">{item.merchandise.name}</h3>
                              {item.size && (
                                <p className="text-xs text-gray-500 mb-1 sm:mb-2">Tamanho: {item.size}</p>
                              )}
                              <p className="text-coisa-black font-semibold text-sm sm:text-base">{item.merchandise.price.toFixed(2)}€ × {item.quantity}</p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3 sm:mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 text-coisa-black rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="w-10 sm:w-12 text-center font-semibold text-coisa-black text-sm sm:text-base">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.merchandise.stock}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded transition-colors flex items-center justify-center ${
                                  item.quantity >= item.merchandise.stock
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-coisa-black hover:bg-gray-300'
                                }`}
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                      <div className="flex justify-between text-lg sm:text-xl font-bold">
                        <span className="text-coisa-black">Total:</span>
                        <span className="text-coisa-black">{cart.totalPrice.toFixed(2)}€</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-3">
                      <button 
                        onClick={handleCheckout}
                        className="w-full py-2.5 sm:py-3 bg-coisa-accent text-white rounded-lg font-semibold hover:bg-coisa-accent-dark transition-colors text-sm sm:text-base"
                      >
                        Finalizar Compra
                      </button>
                      <button
                        onClick={handleClearCart}
                        className="w-full py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-coisa-black rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                      >
                        Limpar Carrinho
                      </button>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Size Selection Modal */}
      {selectedProduct && (
        <>
          {/* Modal Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            {/* Modal Content */}
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-coisa-black">Selecione o Tamanho</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-coisa-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-coisa-black font-semibold mb-4">{selectedProduct.name}</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.variants?.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSize(variant.size);
                        setSizeQuantityValue(1);
                      }}
                      className={`py-3 rounded-lg font-semibold transition-colors ${
                        selectedSize === variant.size
                          ? 'bg-coisa-accent text-white'
                          : 'bg-gray-100 border border-gray-300 text-coisa-black hover:border-coisa-accent'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-coisa-black mb-2">Quantidade:</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSizeQuantityValue(Math.max(1, sizeQuantityValue - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 text-coisa-black hover:bg-gray-50"
                    disabled={!selectedSize}
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <div className="w-16 h-10 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-coisa-black">
                    {sizeQuantityValue}
                  </div>
                  <button
                    onClick={() => setSizeQuantityValue(Math.min(getSelectedVariantStock() || 1, sizeQuantityValue + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 text-coisa-black hover:bg-gray-50"
                    disabled={!selectedSize}
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                  <span className="text-xs text-gray-500">máx: {selectedSize ? getSelectedVariantStock() : 0}</span>
                </div>
              </div>

              <button
                onClick={confirmSizeSelection}
                disabled={!selectedSize || getSelectedVariantStock() === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedSize && getSelectedVariantStock() > 0
                    ? 'bg-coisa-accent text-white hover:bg-coisa-accent-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </>
      )}

      {/* Quantity Selection Modal */}
      {quantityProduct && (
        <>
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setQuantityProduct(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-coisa-black">Escolher Quantidade</h3>
                <button
                  onClick={() => setQuantityProduct(null)}
                  className="text-gray-400 hover:text-coisa-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {quantityProduct.imageUrl ? (
                    <img
                      src={quantityProduct.imageUrl.startsWith('http')
                        ? quantityProduct.imageUrl
                        : `http://localhost:3000${quantityProduct.imageUrl}`}
                      alt={quantityProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-coisa-black">{quantityProduct.name}</p>
                  <p className="text-[#D9534F] font-semibold">{quantityProduct.price.toFixed(2)}€</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-coisa-black mb-2">Quantidade:</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantityValue(Math.max(1, quantityValue - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 text-coisa-black hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <div className="w-16 h-10 border border-gray-200 rounded-lg flex items-center justify-center font-semibold text-coisa-black">
                    {quantityValue}
                  </div>
                  <button
                    onClick={() => setQuantityValue(Math.min(getMaxQuantity(), quantityValue + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 text-coisa-black hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                  <span className="text-xs text-gray-500">máx: {getMaxQuantity()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantityProduct(null)}
                  className="w-full py-3 bg-white border border-gray-200 rounded-lg text-coisa-black hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmQuantitySelection}
                  className="w-full py-3 rounded-lg font-semibold bg-coisa-accent text-white hover:bg-coisa-accent-dark"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
