/**
 * Album Service
 * Serviço para gerenciar álbuns/pastas da galeria
 */

import { api } from '@/utils/api';

export interface Album {
  id: number;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  order: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    images: number;
  };
  images?: any[];
}

export interface CreateAlbumData {
  name: string;
  description?: string;
  isPublic?: boolean;
  order?: number;
}

class AlbumService {
  /**
   * Lista todos os álbuns
   */
  async getAll(): Promise<Album[]> {
    return api.get<Album[]>('/albums');
  }

  /**
   * Busca um álbum específico por ID com suas imagens
   */
  async getById(id: number): Promise<Album> {
    return api.get<Album>(`/albums/${id}`);
  }

  /**
   * Cria um novo álbum (admin)
   */
  async create(data: CreateAlbumData): Promise<Album> {
    return api.post<Album>('/albums', data);
  }

  /**
   * Atualiza um álbum existente (admin)
   */
  async update(id: number, data: Partial<CreateAlbumData>): Promise<Album> {
    return api.put<Album>(`/albums/${id}`, data);
  }

  /**
   * Remove um álbum (admin)
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/albums/${id}`);
  }
}

export const albumService = new AlbumService();
