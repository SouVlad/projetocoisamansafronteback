import prisma from "./src/prisma.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Populando a base de dados...\n");

    // Limpar dados existentes (ordem correta para evitar conflitos de FK)
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.merchandiseVariant.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.newsArticle.deleteMany();
    await prisma.merchandise.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    console.log("✓ Dados antigos removidos\n");

    // 1. Criar Usuários
    console.log("👤 Criando usuários...");
    const ownerPassword = await bcrypt.hash("MinhaPasswordSegura123!", 10);
    const hashedPassword = await bcrypt.hash("password123", 10);

    const owner = await prisma.user.create({
      data: {
        username: "Coisa Mansa",
        email: "coisamansanotif@gmail.com",
        password: ownerPassword,
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
          description: "Grande concerto na Casa da Música! Juntem-se a nós para uma noite inesquecível de música ao vivo.",
          location: "Casa da Música, Porto",
          startsAt: new Date("2026-02-15T20:00:00Z"),
          endsAt: new Date("2026-02-15T23:00:00Z"),
          isPublic: true,
          createdById: owner.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Festival de Jazz em Lisboa",
          description: "Participação especial no Festival de Jazz de Lisboa com outros grandes artistas nacionais.",
          location: "Coliseu dos Recreios, Lisboa",
          startsAt: new Date("2026-03-20T21:00:00Z"),
          endsAt: new Date("2026-03-21T01:00:00Z"),
          isPublic: true,
          createdById: owner.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Concerto Acústico Intimista",
          description: "Sessão íntima e acústica num ambiente único. Lugares limitados!",
          location: "Teatro Municipal, Coimbra",
          startsAt: new Date("2026-04-10T19:30:00Z"),
          endsAt: new Date("2026-04-10T22:00:00Z"),
          isPublic: true,
          createdById: admin.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Festival NOS Alive 2026",
          description: "Confirmados no NOS Alive! Preparem-se para o verão!",
          location: "Passeio Marítimo de Algés, Lisboa",
          startsAt: new Date("2026-07-12T22:00:00Z"),
          isPublic: true,
          createdById: owner.id,
        },
      }),
      prisma.event.create({
        data: {
          title: "Ensaio Privado",
          description: "Ensaio fechado para a banda - preparação do novo álbum.",
          location: "Estúdio da banda",
          startsAt: new Date("2026-02-01T15:00:00Z"),
          isPublic: false,
          createdById: owner.id,
        },
      }),
    ]);
    console.log(`✓ ${events.length} eventos criados\n`);

    // 3. Criar Notícias
    console.log("📰 Criando notícias...");
    const news = await Promise.all([
      prisma.newsArticle.create({
        data: {
          title: "Novo Álbum a Caminho!",
          summary: "Estamos a trabalhar no nosso segundo álbum de estúdio.",
          content: "É com grande entusiasmo que anunciamos que estamos em fase de gravação do nosso segundo álbum! Este projeto promete trazer novos sons e experiências musicais únicas. Fiquem atentos às nossas redes sociais para mais novidades em breve.",
          isPublished: true,
          publishedAt: new Date("2026-01-15T10:00:00Z"),
          authorId: owner.id,
        },
      }),
      prisma.newsArticle.create({
        data: {
          title: "Confirmados no NOS Alive 2026",
          summary: "Vamos estar presentes num dos maiores festivais de Portugal!",
          content: "Temos o prazer de confirmar a nossa presença no NOS Alive 2026! Será uma noite épica no palco principal do festival. Preparem-se para cantar connosco os maiores êxitos e algumas surpresas. Bilhetes já disponíveis!",
          isPublished: true,
          publishedAt: new Date("2026-01-20T14:30:00Z"),
          authorId: owner.id,
        },
      }),
      prisma.newsArticle.create({
        data: {
          title: "Entrevista na Rádio Comercial",
          summary: "Passem pela Rádio Comercial amanhã às 16h!",
          content: "Amanhã estaremos ao vivo na Rádio Comercial para uma entrevista especial. Vamos falar sobre os nossos projetos, tocar algumas músicas ao vivo e revelar alguns segredos. Não percam!",
          isPublished: true,
          publishedAt: new Date("2026-02-01T09:00:00Z"),
          authorId: admin.id,
        },
      }),
      prisma.newsArticle.create({
        data: {
          title: "Merchandising Renovado",
          summary: "Nova coleção de merchandise já disponível!",
          content: "A nossa nova coleção de merchandise já está disponível na loja online! Designs exclusivos, qualidade premium e produtos para todos os gostos. Façam já as vossas encomendas!",
          isPublished: true,
          publishedAt: new Date("2026-02-03T12:00:00Z"),
          authorId: admin.id,
        },
      }),
      prisma.newsArticle.create({
        data: {
          title: "[RASCUNHO] Tour Europeia 2026",
          summary: "A preparar concertos em várias cidades europeias.",
          content: "Estamos a trabalhar numa possível tour europeia para o segundo semestre de 2026. Mais informações em breve...",
          isPublished: false,
          authorId: owner.id,
        },
      }),
    ]);
    console.log(`✓ ${news.length} notícias criadas\n`);

    // 4. Criar Merchandise com Categorias e Variantes
    console.log("👕 Criando merchandise...");
    
    // ROUPA
    const tshirt = await prisma.merchandise.create({
      data: {
        name: "T-Shirt Coisa Mansa Logo",
        description: "T-shirt oficial da banda com logo bordado em alta qualidade. 100% algodão.",
        price: 19.99,
        stock: 0, // Stock nas variants
        category: "OUTRO",
        isActive: true,
      },
    });

    const tshirtVariants = [
      { merchandiseId: tshirt.id, size: "XS", stock: 10 },
      { merchandiseId: tshirt.id, size: "S", stock: 15 },
      { merchandiseId: tshirt.id, size: "M", stock: 25 },
      { merchandiseId: tshirt.id, size: "L", stock: 20 },
      { merchandiseId: tshirt.id, size: "XL", stock: 10 },
      { merchandiseId: tshirt.id, size: "XXL", stock: 8 },
    ];

    await prisma.merchandiseVariant.createMany({
      data: tshirtVariants,
    });

    // Atualizar stock total da T-shirt
    const tshirtTotalStock = tshirtVariants.reduce((sum, v) => sum + v.stock, 0);
    await prisma.merchandise.update({
      where: { id: tshirt.id },
      data: { stock: tshirtTotalStock },
    });

    const hoodie = await prisma.merchandise.create({
      data: {
        name: "Hoodie Premium Coisa Mansa",
        description: "Hoodie premium com bordado e capuz forrado. Conforto máximo!",
        price: 39.99,
        stock: 0,
        category: "OUTRO",
        isActive: true,
      },
    });

    const hoodieVariants = [
      { merchandiseId: hoodie.id, size: "XS", stock: 5 },
      { merchandiseId: hoodie.id, size: "S", stock: 8 },
      { merchandiseId: hoodie.id, size: "M", stock: 12 },
      { merchandiseId: hoodie.id, size: "L", stock: 10 },
      { merchandiseId: hoodie.id, size: "XL", stock: 5 },
      { merchandiseId: hoodie.id, size: "XXL", stock: 4 },
    ];

    await prisma.merchandiseVariant.createMany({
      data: hoodieVariants,
    });

    // Atualizar stock total do Hoodie
    const hoodieTotalStock = hoodieVariants.reduce((sum, v) => sum + v.stock, 0);
    await prisma.merchandise.update({
      where: { id: hoodie.id },
      data: { stock: hoodieTotalStock },
    });

    // CDs e Vinis
    const cd = await prisma.merchandise.create({
      data: {
        name: "CD - Primeiro Álbum",
        description: "CD físico com todas as músicas do primeiro álbum. Inclui booklet com letras.",
        price: 12.99,
        stock: 30,
        category: "OUTRO",
        isActive: true,
      },
    });

    const vinil = await prisma.merchandise.create({
      data: {
        name: "Vinil - Edição Limitada",
        description: "Edição limitada em vinil 180g. Apenas 500 cópias numeradas!",
        price: 29.99,
        stock: 45,
        category: "OUTRO",
        isActive: true,
      },
    });

    // Posters e Acessórios
    const poster = await prisma.merchandise.create({
      data: {
        name: "Poster Oficial Autografado",
        description: "Poster autografado pela banda (tamanho A2). Edição limitada.",
        price: 9.99,
        stock: 100,
        category: "OUTRO",
        isActive: true,
      },
    });

    const bone = await prisma.merchandise.create({
      data: {
        name: "Boné Coisa Mansa",
        description: "Boné ajustável com logo bordado. Design exclusivo.",
        price: 14.99,
        stock: 40,
        category: "OUTRO",
        isActive: true,
      },
    });

    const caneca = await prisma.merchandise.create({
      data: {
        name: "Caneca de Cerâmica",
        description: "Caneca de cerâmica com design exclusivo da banda. Capacidade 350ml.",
        price: 8.99,
        stock: 60,
        category: "OUTRO",
        isActive: true,
      },
    });

    const pendrive = await prisma.merchandise.create({
      data: {
        name: "Pendrive USB com Discografia",
        description: "Pendrive 8GB com toda a discografia da banda em MP3 320kbps.",
        price: 15.99,
        stock: 25,
        category: "OUTRO",
        isActive: true,
      },
    });

    console.log("✓ 8 produtos criados com variantes\n");

    console.log("✅ Base de dados populada com sucesso!\n");
    console.log("📊 Resumo:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✓ ${3} utilizadores criados`);
    console.log(`✓ ${events.length} eventos criados`);
    console.log(`✓ ${news.length} notícias criadas (${news.filter(n => n.isPublished).length} publicadas)`);
    console.log(`✓ 8 produtos criados (com variantes XS-XXL)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
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
