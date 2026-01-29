import prisma from "./src/prisma.js";

async function checkSchema() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryImage' 
      ORDER BY ordinal_position
    `;
    
    console.log('Colunas da tabela GalleryImage:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Tentar buscar imagens
    const images = await prisma.galleryImage.findMany();
    console.log(`\n✅ ${images.length} imagens encontradas`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
