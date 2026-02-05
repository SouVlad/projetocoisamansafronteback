// src/controllers/galleryController.js
import prisma from "../prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Listar todas as imagens da galeria (público)
 * Suporta filtros: ?category=2024 ou ?year=2024
 */
export async function listGalleryImages(req, res) {
  try {
    const { year } = req.query;
    
    // Construir filtro dinâmico
    const where = {};
    if (year) {
      where.year = parseInt(year);
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Adicionar URL completa para cada imagem
    const imagesWithUrls = images.map((img) => ({
      ...img,
      url: `/uploads/gallery/${img.filename}`,
    }));

    res.json(imagesWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar imagens da galeria." });
  }
}

/**
 * Obter uma imagem específica por ID
 */
export async function getGalleryImage(req, res) {
  try {
    const id = Number(req.params.id);
    const image = await prisma.galleryImage.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    res.json({
      ...image,
      url: `/uploads/gallery/${image.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter imagem." });
  }
}

/**
 * Upload de uma nova imagem (admin apenas)
 */
export async function uploadGalleryImage(req, res) {
  try {
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
    }

    const { title, description, year, albumId } = req.body;

    if (!title) {
      // Se não houver título, remover o arquivo
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "O título é obrigatório." });
    }

    // Verificar se já existe uma imagem com este título
    const existingImage = await prisma.galleryImage.findFirst({
      where: { title }
    });

    if (existingImage) {
      // Remover o arquivo que foi enviado
      fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: "Já existe uma imagem com este título." });
    }

    // Criar registro na base de dados
    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        year: year ? parseInt(year) : null,
        albumId: albumId ? parseInt(albumId) : null,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedById: req.user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
        album: true
      },
    });

    res.status(201).json({
      ...image,
      url: `/uploads/gallery/${image.filename}`,
      message: "Imagem carregada com sucesso!",
    });
  } catch (err) {
    console.error(err);
    // Se houver erro, remover o arquivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Erro ao fazer upload da imagem." });
  }
}

/**
 * Atualizar informações de uma imagem (admin apenas)
 */
export async function updateGalleryImage(req, res) {
  try {
    const id = Number(req.params.id);
    const { title, description, year } = req.body;

    const existingImage = await prisma.galleryImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    // Verificar se o novo título já existe (e não pertence a esta imagem)
    const newTitle = title || existingImage.title;
    if (title && title !== existingImage.title) {
      const duplicateTitle = await prisma.galleryImage.findFirst({
        where: {
          title: newTitle,
          id: { not: id }
        }
      });
      
      if (duplicateTitle) {
        return res.status(409).json({ error: "Já existe uma imagem com este título." });
      }
    }

    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: {
        title: newTitle,
        description: description !== undefined ? description : existingImage.description,
        year: year !== undefined ? (year ? parseInt(year) : null) : existingImage.year,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json({
      ...updatedImage,
      url: `/uploads/gallery/${updatedImage.filename}`,
      message: "Imagem atualizada com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar imagem." });
  }
}

/**
 * Deletar uma imagem (admin apenas)
 */
export async function deleteGalleryImage(req, res) {
  try {
    const id = Number(req.params.id);

    const image = await prisma.galleryImage.findUnique({ where: { id } });

    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    // Remover arquivo físico
    const filePath = path.join(__dirname, "../../uploads/gallery", image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover registro da base de dados
    await prisma.galleryImage.delete({ where: { id } });

    res.json({ message: "Imagem removida com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover imagem." });
  }
}

/**
 * Obter todas as categorias e anos disponíveis
 */
export async function getGalleryCategories(req, res) {
  try {
    // Buscar todos anos únicos
    const years = await prisma.galleryImage.findMany({
      where: {
        year: {
          not: null
        }
      },
      select: {
        year: true,
      },
      distinct: ['year'],
      orderBy: {
        year: 'desc'
      }
    });

    res.json({
      categories: [],
      years: years.map(y => y.year).filter(Boolean),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter categorias." });
  }
}
