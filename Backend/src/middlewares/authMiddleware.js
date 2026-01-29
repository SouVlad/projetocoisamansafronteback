import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { JWT_SECRET } from '../config/constants.js';

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      // Anexa o ID do usuário para uso posterior, se necessário
      req.user = { id: decoded.userId, role: decoded.role };
    } catch (error) {
      // Ignora o erro, a rota é opcional
    }
  }
  next();
}

export const requireAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true } // Não exponha a senha
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, token não fornecido.' });
  }
};

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  // ADMIN e OWNER têm permissões de admin
  if (req.user.role === "ADMIN" || req.user.role === "OWNER") {
    return next();
  }

  return res.status(403).json({ error: "Sem permissão. Apenas administradores." });
}

export function requireOwner(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  // Apenas OWNER tem acesso
  if (req.user.role === "OWNER") {
    return next();
  }

  return res.status(403).json({ error: "Sem permissão. Apenas proprietário." });
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    // OWNER tem acesso a tudo
    if (req.user.role === 'OWNER' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ error: "Sem permissão." });
  };
}
