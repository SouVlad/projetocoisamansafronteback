/**
 * Gallery Service
 * Serviço para gerenciar galeria de fotos
 */

import { api } from '@/utils/api';

export interface GalleryImage {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImageData {
  title?: string;
  description?: string;
  category?: string;
}

class GalleryService {
  /**
   * Lista todas as imagens da galeria
   */
  async getAll(category?: string): Promise<GalleryImage[]> {
    const endpoint = category ? `/gallery?category=${category}` : '/gallery';
    return api.get<GalleryImage[]>(endpoint);
  }

  /**
   * Busca uma imagem específica por ID
   */
  async getById(id: string): Promise<GalleryImage> {
    return api.get<GalleryImage>(`/gallery/${id}`);
  }

  /**
   * Upload de nova imagem
   */
  async upload(file: File, data?: CreateGalleryImageData): Promise<GalleryImage> {
    const formData = new FormData();
    formData.append('image', file);
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
    }
    
    return api.upload<GalleryImage>('/gallery', formData);
  }

  /**
   * Atualiza informações de uma imagem
   */
  async update(id: string, data: Partial<CreateGalleryImageData>): Promise<GalleryImage> {
    return api.put<GalleryImage>(`/gallery/${id}`, data);
  }

  /**
   * Remove uma imagem da galeria
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/gallery/${id}`);
  }

  /**
   * Reordena imagens na galeria
   */
  async reorder(imageIds: string[]): Promise<void> {
    return api.post('/gallery/reorder', { imageIds });
  }
}

export const galleryService = new GalleryService();
