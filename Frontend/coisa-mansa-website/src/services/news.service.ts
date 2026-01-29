/**
 * News Service
 * Serviço para gerenciar notícias/blog
 */

import { api } from '@/utils/api';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  isPublished: boolean;
  publishedAt?: string;
  authorId: number;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleData {
  title: string;
  summary: string;
  content: string;
  isPublished?: boolean;
}

export interface UpdateArticleData {
  title?: string;
  summary?: string;
  content?: string;
  isPublished?: boolean;
}

class NewsService {
  /**
   * Lista artigos publicados (público)
   */
  async getPublicArticles(): Promise<NewsArticle[]> {
    return api.get<NewsArticle[]>('/news/public');
  }

  /**
   * Lista todos os artigos incluindo rascunhos (admin)
   */
  async getAll(): Promise<NewsArticle[]> {
    return api.get<NewsArticle[]>('/news');
  }

  /**
   * Lista todos os artigos incluindo rascunhos (admin) - alias para compatibilidade
   */
  async getAllArticles(): Promise<NewsArticle[]> {
    return this.getAll();
  }

  /**
   * Busca um artigo específico por ID
   */
  async getById(id: number): Promise<NewsArticle> {
    return api.get<NewsArticle>(`/news/${id}`);
  }

  /**
   * Cria novo artigo (admin)
   */
  async create(data: CreateArticleData): Promise<NewsArticle> {
    return api.post<NewsArticle>('/news', data);
  }

  /**
   * Atualiza artigo existente (admin)
   */
  async update(id: number, data: UpdateArticleData): Promise<NewsArticle> {
    return api.put<NewsArticle>(`/news/${id}`, data);
  }

  /**
   * Elimina artigo (admin)
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/news/${id}`);
  }

  /**
   * Toggle publicação (admin)
   */
  async togglePublish(id: number): Promise<NewsArticle> {
    return api.patch<NewsArticle>(`/news/${id}/toggle-publish`);
  }
}

export const newsService = new NewsService();
