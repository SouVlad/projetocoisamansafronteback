export interface User {
  id: number;
  email: string;
  username: string;
  role: 'ADMIN' | 'USER' | 'OWNER';
  superAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  endsAt?: string;
  isPublic: boolean;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface Concert {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  category: 'concert' | 'studio' | 'band' | 'other';
  uploadedAt: Date;
  uploadedBy: string;
}

export type MerchandiseCategory = 'ROUPA' | 'CD' | 'VINIL' | 'POSTER' | 'ACESSORIO';

export interface MerchItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: MerchandiseCategory;
  isActive: boolean;
  variants?: { size: string; stock: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ConcertFormData {
  title: string;
  date: string;
  venue: string;
  city: string;
  address: string;
  description: string;
  ticketPrice: number;
  ticketUrl?: string;
}

export interface MerchFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}