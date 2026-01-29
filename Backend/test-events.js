import prisma from "./src/prisma.js";

async function testEvents() {
  try {
    console.log("Conectando ao banco de dados...");
    
    // Verificar conexão
    await prisma.$connect();
    console.log("✓ Conexão estabelecida!");
    
    // Buscar eventos
    const events = await prisma.event.findMany();
    console.log(`\n✓ Encontrados ${events.length} evento(s):`);
    console.log(JSON.stringify(events, null, 2));
    
    // Criar um evento de teste se não houver nenhum
    if (events.length === 0) {
      console.log("\nCriando evento de teste...");
      
      // Primeiro, verificar se há usuários
      const users = await prisma.user.findMany();
      if (users.length === 0) {
        console.log("⚠ Nenhum usuário encontrado. Criando usuário de teste...");
        const testUser = await prisma.user.create({
          data: {
            username: "admin",
            email: "admin@test.com",
            password: "test123",
            role: "ADMIN"
          }
        });
        console.log(`✓ Usuário criado: ${testUser.username}`);
      }
      
      const firstUser = await prisma.user.findFirst();
      
      const testEvent = await prisma.event.create({
        data: {
          title: "Concerto de Teste",
          description: "Evento de teste para verificar a API",
          location: "Local de Teste",
          startsAt: new Date("2026-02-15T20:00:00Z"),
          isPublic: true,
          createdById: firstUser.id
        }
      });
      console.log(`✓ Evento de teste criado: ${testEvent.title}`);
    }
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testEvents();
