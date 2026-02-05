import prisma from "../prisma.js";

// Listar todos os álbuns (admin vê todos, público vê apenas públicos)
export async function listAlbums(req, res) {
  try {
    const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "OWNER";
    const where = isAdmin ? {} : { isPublic: true };

    const albums = await prisma.album.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { images: true }
        },
        images: {
          take: 1, // Pegar primeira imagem para usar como capa se não houver coverImage
          orderBy: { createdAt: "desc" }
        }
      }
    });

    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar álbuns." });
  }
}

// Obter um álbum específico com suas imagens
export async function getAlbum(req, res) {
  try {
    const id = Number(req.params.id);
    const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "OWNER";

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "desc" }
        },
        _count: {
          select: { images: true }
        }
      }
    });

    if (!album) {
      return res.status(404).json({ error: "Álbum não encontrado" });
    }

    if (!album.isPublic && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter álbum." });
  }
}

// Criar novo álbum (apenas admin/owner)
export async function createAlbum(req, res) {
  try {
    const { name, description, isPublic, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome do álbum é obrigatório" });
    }

    // Verificar se já existe um álbum com este nome
    const existingAlbum = await prisma.album.findFirst({
      where: { name }
    });

    if (existingAlbum) {
      return res.status(409).json({ error: "Já existe um álbum com este nome." });
    }

    const album = await prisma.album.create({
      data: {
        name,
        description,
        isPublic: isPublic !== undefined ? isPublic : true,
        order: order || 0,
        createdById: req.user.id
      }
    });

    res.status(201).json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar álbum." });
  }
}

// Atualizar álbum (apenas admin/owner)
export async function updateAlbum(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, description, isPublic, order, coverImage } = req.body;

    // Verificar se o novo nome já existe (e não pertence a este álbum)
    if (name) {
      const existingAlbum = await prisma.album.findUnique({
        where: { id }
      });

      if (!existingAlbum) {
        return res.status(404).json({ error: "Álbum não encontrado" });
      }

      if (name !== existingAlbum.name) {
        const duplicateName = await prisma.album.findFirst({
          where: {
            name: name,
            id: { not: id }
          }
        });

        if (duplicateName) {
          return res.status(409).json({ error: "Já existe um álbum com este nome." });
        }
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (order !== undefined) updateData.order = order;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    const album = await prisma.album.update({
      where: { id },
      data: updateData
    });

    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar álbum." });
  }
}

// Deletar álbum (apenas admin/owner)
export async function deleteAlbum(req, res) {
  try {
    const id = Number(req.params.id);

    // Verificar se há imagens no álbum
    const album = await prisma.album.findUnique({
      where: { id },
      include: { _count: { select: { images: true } } }
    });

    if (!album) {
      return res.status(404).json({ error: "Álbum não encontrado" });
    }

    if (album._count.images > 0) {
      return res.status(400).json({ 
        error: "Não é possível deletar álbum com imagens. Remove as imagens primeiro." 
      });
    }

    await prisma.album.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar álbum." });
  }
}
