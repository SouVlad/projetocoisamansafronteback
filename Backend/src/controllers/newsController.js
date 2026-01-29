// src/controllers/newsController.js
import prisma from "../prisma.js";

/**
 * Listar todos os artigos publicados (público)
 */
export async function listPublicArticles(req, res) {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar artigos." });
  }
}

/**
 * Listar todos os artigos (admin apenas) - inclui rascunhos
 */
export async function listAllArticles(req, res) {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar artigos." });
  }
}

/**
 * Obter um artigo específico por ID
 */
export async function getArticle(req, res) {
  try {
    const id = Number(req.params.id);
    const article = await prisma.newsArticle.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    // Se não for publicado e o user não for admin/owner, não mostrar
    if (!article.isPublished && req.user.role === 'USER') {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter artigo." });
  }
}

/**
 * Criar novo artigo (admin/owner apenas)
 */
export async function createArticle(req, res) {
  try {
    const { title, summary, content, isPublished } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ 
        error: "Título, resumo e conteúdo são obrigatórios." 
      });
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        summary,
        content,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json({
      ...article,
      message: "Artigo criado com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar artigo." });
  }
}

/**
 * Atualizar artigo (admin/owner apenas)
 */
export async function updateArticle(req, res) {
  try {
    const id = Number(req.params.id);
    const { title, summary, content, isPublished } = req.body;

    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    // Se está a ser publicado pela primeira vez, definir publishedAt
    const publishedAt = isPublished && !existingArticle.isPublished
      ? new Date()
      : existingArticle.publishedAt;

    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingArticle.title,
        summary: summary !== undefined ? summary : existingArticle.summary,
        content: content !== undefined ? content : existingArticle.content,
        isPublished: isPublished !== undefined ? isPublished : existingArticle.isPublished,
        publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json({
      ...updatedArticle,
      message: "Artigo atualizado com sucesso!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar artigo." });
  }
}

/**
 * Eliminar artigo (admin/owner apenas)
 */
export async function deleteArticle(req, res) {
  try {
    const id = Number(req.params.id);

    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    await prisma.newsArticle.delete({
      where: { id },
    });

    res.json({ message: "Artigo eliminado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao eliminar artigo." });
  }
}

/**
 * Toggle publish status (admin/owner apenas)
 */
export async function togglePublish(req, res) {
  try {
    const id = Number(req.params.id);

    const existingArticle = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    const updatedArticle = await prisma.newsArticle.update({
      where: { id },
      data: {
        isPublished: !existingArticle.isPublished,
        publishedAt: !existingArticle.isPublished ? new Date() : existingArticle.publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json({
      ...updatedArticle,
      message: `Artigo ${updatedArticle.isPublished ? 'publicado' : 'despublicado'} com sucesso!`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao alterar estado de publicação." });
  }
}
