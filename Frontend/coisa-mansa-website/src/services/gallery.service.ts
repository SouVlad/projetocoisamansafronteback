/**
 * Gallery Service
 * Serviço para gerenciar galeria de fotos
 */

import { api } from '@/utils/api';

export interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  category?: string;
  year?: number;
  uploadedById: number;
  uploadedBy: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  category?: string;
  year?: number;
  albumId?: number;
}

export interface GalleryCategories {
  categories: string[];
  years: number[];
}

class GalleryService {
  /**
   * Lista todas as imagens da galeria
   * Pode filtrar por categoria ou ano: ?category=2024 ou ?year=2024
   */
  async getAll(filters?: { category?: string; year?: number }): Promise<GalleryImage[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.year) params.append('year', filters.year.toString());
    
    const queryString = params.toString();
    return api.get<GalleryImage[]>(`/gallery${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Busca uma imagem específica por ID
   */
  async getById(id: number): Promise<GalleryImage> {
    return api.get<GalleryImage>(`/gallery/${id}`);
  }

  /**
   * Obtém todas as categorias e anos disponíveis
   */
  async getCategories(): Promise<GalleryCategories> {
    return api.get<GalleryCategories>('/gallery/categories');
  }

  /**
   * Upload de nova imagem
   */
  async upload(file: File, data: CreateGalleryImageData): Promise<GalleryImage> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', data.title);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.category) {
      formData.append('category', data.category);
    }
    
    if (data.year) {
      formData.append('year', data.year.toString());
    }
    
    if (data.albumId) {
      formData.append('albumId', data.albumId.toString());
    }
    
    return api.upload<GalleryImage>('/gallery', formData);
  }

  /**
   * Atualiza informações de uma imagem
   */
  async update(id: number, data: Partial<CreateGalleryImageData>): Promise<GalleryImage> {
    return api.put<GalleryImage>(`/gallery/${id}`, data);
  }

  /**
   * Remove uma imagem da galeria
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/gallery/${id}`);
  }
}

export const galleryService = new GalleryService();
