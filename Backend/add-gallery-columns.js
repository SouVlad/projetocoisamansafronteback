import prisma from "./src/prisma.js";

async function addColumns() {
  try {
    // Adicionar coluna category
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "GalleryImage" 
      ADD COLUMN IF NOT EXISTS category TEXT
    `);
    console.log('✅ Coluna "category" adicionada');
    
    // Adicionar coluna year
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "GalleryImage" 
      ADD COLUMN IF NOT EXISTS year INTEGER
    `);
    console.log('✅ Coluna "year" adicionada');
    
    console.log('\n✅ Todas as colunas foram adicionadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addColumns();
