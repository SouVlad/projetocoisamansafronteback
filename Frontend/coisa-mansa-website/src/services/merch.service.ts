/**
 * Merchandise Service
 * Serviço para gerenciar produtos/merchandise
 */

import { api } from '@/utils/api';
import { MerchItem } from '@/types';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
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
   * Cria um novo produto (admin)
   */
  async create(data: CreateProductData): Promise<MerchItem> {
    return api.post<MerchItem>('/merchandise', data);
  }

  /**
   * Atualiza um produto existente (admin)
   */
  async update(id: number, data: Partial<CreateProductData>): Promise<MerchItem> {
    return api.put<MerchItem>(`/merchandise/${id}`, data);
  }

  /**
   * Remove um produto (admin)
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/merchandise/${id}`);
  }
}

export const merchService = new MerchService();
