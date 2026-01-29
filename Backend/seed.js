import prisma from "./src/prisma.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Populando a base de dados...\n");

    // Limpar dados existentes
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.merchandise.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    console.log("✓ Dados antigos removidos\n");

    // 1. Criar Usuários
    console.log("Criando usuários...");
    const ownerPassword = await bcrypt.hash("MinhaPasswordSegura123!", 10); // ← Muda aqui!
    const hashedPassword = await bcrypt.hash("password123", 10);

    const owner = await prisma.user.create({
      data: {
        username: "owner",
        email: "coisamansanotif@gmail.com",
        password: ownerPassword, // ← Password específica para owner
        role: "OWNER",
      },
    });
    console.log(`✓ OWNER criado: ${owner.username}`);

    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@coisamansa.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`✓ ADMIN criado: ${admin.username}`);

    const user = await prisma.user.create({
      data: {
        username: "user",
        email: "user@coisamansa.com",
        password: hashedPassword,
        role: "USER",
      },
    });
    console.log(`✓ USER criado: ${user.username}\n`);

    // 2. Criar Eventos
    console.log("🎵 Criando eventos...");
    const events = await Promise.all([
      prisma.event.create({
        data: {
          title: "Concerto Casa da Música do Porto",
          description: "Grande concerto na Casa da Música! Não percam!",
          location: "Casa da Música, Porto",
          startsAt: new Date("2026-02-15T20:00:00Z"),
          isPublic: true,
          createdById: owner.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Festival de Jazz em Lisboa",
          description: "Participação especial no Festival de Jazz",
          location: "Coliseu dos Recreios, Lisboa",
          startsAt: new Date("2026-03-20T21:00:00Z"),
          isPublic: true,
          createdById: owner.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Concerto Acústico",
          description: "Sessão íntima e acústica",
          location: "Teatro Municipal, Coimbra",
          startsAt: new Date("2026-04-10T19:30:00Z"),
          isPublic: true,
          createdById: admin.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Ensaio Privado",
          description: "Ensaio fechado para a banda",
          location: "Estúdio da banda",
          startsAt: new Date("2026-02-01T15:00:00Z"),
          isPublic: false,
          createdById: owner.id,
        },
      }),
    ]);
    console.log(`✓ ${events.length} eventos criados\n`);

    // 3. Criar Merchandise
    console.log("👕 Criando merchandise...");
    const merchandise = await Promise.all([
      prisma.merchandise.create({
        data: {
          name: "T-Shirt Coisa Mansa",
          description: "T-shirt oficial da banda com logo",
          price: 19.99,
          stock: 50,
          isActive: true,
        },
      }),
      prisma.merchandise.create({
        data: {
          name: "CD - Primeiro Álbum",
          description: "CD físico com todas as músicas do primeiro álbum",
          price: 12.99,
          stock: 30,
          isActive: true,
        },
      }),
      prisma.merchandise.create({
        data: {
          name: "Poster da Banda",
          description: "Poster autografado da banda (tamanho A2)",
          price: 9.99,
          stock: 100,
          isActive: true,
        },
      }),
      prisma.merchandise.create({
        data: {
          name: "Hoodie Coisa Mansa",
          description: "Hoodie premium com bordado",
          price: 39.99,
          stock: 25,
          isActive: true,
        },
      }),
    ]);
    console.log(`✓ ${merchandise.length} produtos criados\n`);

    console.log("✅ Base de dados populada com sucesso!\n");
    console.log("🔑 Credenciais de acesso:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("OWNER:  coisamansanotif@gmail.com  / MinhaPasswordSegura123!");
    console.log("ADMIN:  admin@coisamansa.com       / password123");
    console.log("USER:   user@coisamansa.com        / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Erro ao popular base de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
