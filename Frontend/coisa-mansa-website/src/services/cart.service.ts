import { api } from '@/utils/api';

export interface CartItem {
  id: number;
  merchandiseId: number;
  quantity: number;
  size?: string;
  merchandise: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
    category: string;
  };
}

export interface CartTotal {
  subtotal: number;
  shipping: number;
  total: number;
  totalPrice: number;
  totalQuantity: number;
  items: CartItem[];
}

export interface Cart extends CartTotal {}

class CartService {
  async getCart(): Promise<Cart> {
    const response = await api.get<{ items: CartItem[] }>('/cart');
    return this.calculateCart(response.items);
  }

  async addItem(merchandiseId: number, quantity: number = 1, size?: string): Promise<Cart> {
    const response = await api.post<{ items: CartItem[] }>('/cart/items', {
      merchandiseId,
      quantity,
      size
    });
    return this.calculateCart(response.items);
  }

  async updateItemQuantity(cartItemId: number, quantity: number): Promise<Cart> {
    const response = await api.put<{ items: CartItem[] }>(`/cart/items/${cartItemId}`, {
      quantity
    });
    return this.calculateCart(response.items);
  }

  async removeItem(cartItemId: number): Promise<Cart> {
    const response = await api.delete<{ items: CartItem[] }>(`/cart/items/${cartItemId}`);
    return this.calculateCart(response.items);
  }

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  }

  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.merchandise.price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 5;
    const total = subtotal + shipping;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      shipping,
      total,
      totalPrice: total,
      totalQuantity
    };
  }
}

export const cartService = new CartService();
