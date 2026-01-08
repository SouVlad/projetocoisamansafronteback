/**
 * Custom Hook para gerenciar galeria
 */

import { useState, useEffect } from 'react';
import { galleryService, GalleryImage } from '@/services/gallery.service';

export const useGallery = (category?: string) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, [category]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getAll(category);
      setImages(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar imagens');
      console.error('Erro ao carregar galeria:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, metadata?: any) => {
    try {
      setUploading(true);
      const newImage = await galleryService.upload(file, metadata);
      setImages(prev => [newImage, ...prev]);
      return { success: true, data: newImage };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await galleryService.delete(id);
      setImages(prev => prev.filter(img => img.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    images,
    loading,
    error,
    uploading,
    loadImages,
    uploadImage,
    deleteImage,
  };
};
