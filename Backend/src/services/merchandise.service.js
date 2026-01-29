import prisma from "../prisma.js";

export async function getAllMerchandise() {
  return await prisma.merchandise.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMerchandiseById(id) {
  const merchandise = await prisma.merchandise.findUnique({
    where: { id },
  });

  if (!merchandise) {
    throw new Error("Produto não encontrado.");
  }

  return merchandise;
}

export async function createMerchandise({ name, description, price, stock, imageUrl }) {
  if (!name || price === undefined || stock === undefined) {
    throw new Error("Nome, preço e stock são obrigatórios.");
  }

  if (price <= 0) {
    throw new Error("Preço deve ser maior que 0.");
  }

  if (stock < 0) {
    throw new Error("Stock não pode ser negativo.");
  }

  const merchandise = await prisma.merchandise.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      isActive: true,
    },
  });

  return merchandise;
}

export async function updateMerchandise(id, { name, description, price, stock, isActive, imageUrl }) {
  const merchandise = await getMerchandiseById(id);

  if (price !== undefined && price <= 0) {
    throw new Error("Preço deve ser maior que 0.");
  }

  if (stock !== undefined && stock < 0) {
    throw new Error("Stock não pode ser negativo.");
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (stock !== undefined) updateData.stock = stock;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  const updated = await prisma.merchandise.update({
    where: { id },
    data: updateData,
  });

  return updated;
}

export async function deleteMerchandise(id) {
  const merchandise = await getMerchandiseById(id);
  
  await prisma.merchandise.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function decreaseStock(merchandiseId, quantity) {
  const merchandise = await getMerchandiseById(merchandiseId);

  if (merchandise.stock < quantity) {
    throw new Error("Stock insuficiente.");
  }

  await prisma.merchandise.update({
    where: { id: merchandiseId },
    data: { stock: { decrement: quantity } },
  });
}
