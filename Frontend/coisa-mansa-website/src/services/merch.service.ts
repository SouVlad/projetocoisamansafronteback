/**
 * Merchandise Service
 * Serviço para gerenciar produtos/merchandise
 */

import { api } from '@/utils/api';
import { MerchItem, MerchandiseCategory } from '@/types';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  category?: MerchandiseCategory;
  variants?: { size: string; stock: number }[];
  available?: boolean;
}

class MerchService {
  /**
   * Lista todos os produtos
   */
  async getAll(): Promise<MerchItem[]> {
    return api.get<MerchItem[]>('/merchandise');
  }

  /**
   * Lista apenas produtos disponíveis
   */
  async getAvailable(): Promise<MerchItem[]> {
    const products = await this.getAll();
    return products.filter(p => p.available && p.stock > 0);
  }

  /**
   * Busca um produto específico por ID
   */
  async getById(id: number): Promise<MerchItem> {
    return api.get<MerchItem>(`/merchandise/${id}`);
  }

  /**
   * Cria um novo produto (admin) com upload de imagem
   */
  async create(file: File | null, data: Omit<CreateProductData, 'imageUrl'>): Promise<MerchItem> {
    const formData = new FormData();
    
    if (file) {
      formData.append('image', file);
    }
    
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', (data.stock || 0).toString());
    if (data.category) formData.append('category', data.category);
    if (data.variants) formData.append('variants', JSON.stringify(data.variants));
    formData.append('available', (data.available !== false).toString());
    
    return api.upload<MerchItem>('/merchandise', formData);
  }

  /**
   * Atualiza um produto existente (admin) com upload opcional de imagem
   */
  async update(id: number, file: File | null, data: Partial<CreateProductData>): Promise<MerchItem> {
    const formData = new FormData();
    
    if (file) {
      formData.append('image', file);
    }
    
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.variants !== undefined) formData.append('variants', JSON.stringify(data.variants));
    if (data.available !== undefined) formData.append('available', data.available.toString());
    
    return api.upload<MerchItem>(`/merchandise/${id}`, formData, 'PUT');
  }

  /**
   * Remove um produto (admin)
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/merchandise/${id}`);
  }
}

export const merchService = new MerchService();
