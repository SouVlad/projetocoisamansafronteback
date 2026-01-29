import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

export async function list(req, res) {
  try {
    const users = await getAllUsers();
    
    const isOwner = req.user.role === "OWNER";
    const isAdmin = req.user.role === "ADMIN";
    
    // OWNER vê todos os utilizadores
    if (isOwner) {
      return res.json(users);
    }
    
    // ADMIN vê apenas USER (não vê outros ADMIN nem OWNER)
    if (isAdmin) {
      const filteredUsers = users.filter(u => u.role === "USER");
      return res.json(filteredUsers);
    }
    
    // Caso contrário, não retorna nada (não deveria chegar aqui devido ao requireAdmin)
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar utilizadores." });
  }
}

export async function getById(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);
    
    const isOwnAccount = req.user.id === userId;
    const isAdmin = req.user.role === "ADMIN" || req.user.role === "OWNER";
    
    if (!isOwnAccount && !isAdmin) {
      return res.status(403).json({ error: "Sem permissão." });
    }
    
    // Apenas OWNER pode ver informações de outro OWNER
    if (user.role === "OWNER" && req.user.id !== userId && req.user.role !== "OWNER") {
      return res.status(403).json({ error: "Não consegues ver informações de um Owner." });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, role } = req.body;
    
    const targetUser = await getUserById(userId);
    const isOwnAccount = req.user.id === userId;
    const isOwner = req.user.role === "OWNER";
    const isAdmin = req.user.role === "ADMIN";
    
    if (!isOwnAccount && !isAdmin && !isOwner) {
      return res.status(403).json({ error: "Sem permissão." });
    }
    
    // Apenas OWNER pode modificar outro OWNER
    if (targetUser.role === "OWNER" && !isOwner) {
      return res.status(403).json({ error: "Apenas o Owner pode modificar outro Owner." });
    }
    
    // ADMIN não pode modificar outro ADMIN (apenas OWNER pode)
    if (!isOwnAccount && isAdmin && !isOwner && targetUser.role === "ADMIN") {
      return res.status(403).json({ error: "Admins não conseguem modificar outros Admins." });
    }
    
    // Ninguém pode alterar a própria role (exceto OWNER pode fazer tudo)
    if (isOwnAccount && role !== undefined && !isOwner) {
      return res.status(403).json({ error: "Não consegues alterar teu próprio role." });
    }
    
    // Apenas OWNER pode atribuir role OWNER
    if (role === "OWNER" && !isOwner) {
      return res.status(403).json({ error: "Apenas o Owner pode atribuir o role de Owner." });
    }
    
    const user = await updateUser(userId, { username, email, role });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar utilizador." });
  }
}

export async function delete_(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const targetUser = await getUserById(userId);
    
    // Ninguém pode deletar um OWNER
    if (targetUser.role === "OWNER") {
      return res.status(403).json({ error: "Não consegues deletar um Owner." });
    }
    
    const isOwnAccount = req.user.id === userId;
    const isOwner = req.user.role === "OWNER";
    const isAdmin = req.user.role === "ADMIN";
    
    // Própria conta pode ser deletada
    if (isOwnAccount) {
      await deleteUser(userId);
      return res.json({ message: "Conta apagada com sucesso." });
    }
    
    // OWNER pode deletar qualquer um (exceto outro OWNER)
    if (isOwner) {
      await deleteUser(userId);
      return res.json({ message: "Utilizador apagado com sucesso." });
    }
    
    // ADMIN pode deletar apenas USER
    if (isAdmin && targetUser.role === "USER") {
      await deleteUser(userId);
      return res.json({ message: "Utilizador apagado com sucesso." });
    }
    
    return res.status(403).json({ error: "Sem permissão para deletar este utilizador." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar utilizador." });
  }
}
