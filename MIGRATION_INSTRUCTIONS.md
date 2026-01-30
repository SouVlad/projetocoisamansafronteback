# Instruções para implementar o sistema de álbuns/pastas da galeria

## 1. Aplicar migração do Prisma

Execute o seguinte comando no terminal a partir da pasta **Backend**:

```bash
cd Backend
npx prisma migrate dev --name add_album_system
```

Este comando irá:
- Criar a tabela `Album` no banco de dados
- Adicionar a coluna `albumId` na tabela `GalleryImage`
- Criar a relação entre imagens e álbuns

## 2. Reiniciar o servidor backend

Após a migração, reinicie o servidor backend para aplicar as mudanças.

## 3. Funcionalidades implementadas

### Backend:
✅ Modelo `Album` no schema do Prisma
✅ Controller completo para gerenciar álbuns (CRUD)
✅ Rotas `/api/albums` para operações com álbuns
✅ Atualização do `galleryController` para suportar `albumId` no upload

### Frontend:

#### Admin:
✅ Nova página **AdminAlbumsPage** (`/admin/albuns`) para gerenciar álbuns
✅ Atualização do **AdminGalleryPage** para permitir selecionar álbum ao fazer upload
✅ Link para "Álbuns" adicionado no menu lateral do admin

#### Público:
✅ Atualização da **GalleryPage** para mostrar álbuns como cards
✅ Ao clicar num álbum, mostra as imagens dentro dele
✅ Botão "Voltar aos álbuns" para navegação

## 4. Como usar

### Como Admin:

1. Aceda a `/admin/albuns`
2. Clique em "Novo Álbum"
3. Preencha o nome (ex: "Concertos 2023") e descrição opcional
4. Defina se o álbum é público ou privado
5. Ao fazer upload de imagens em `/admin/galeria`, selecione o álbum no dropdown

### Como Utilizador:

1. Aceda a `/galeria`
2. Verá cards com todos os álbuns disponíveis
3. Clique num álbum para ver as imagens dentro dele
4. Use o botão "Voltar aos álbuns" para regressar

## 5. Recursos adicionais

- Álbuns podem ser ordenados (campo `order`)
- Álbuns privados só são visíveis para admins
- Álbuns vazios podem ser eliminados
- A primeira imagem de cada álbum é usada como capa

