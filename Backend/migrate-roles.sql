-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- Migrar dados existentes: se superAdmin = true, vira OWNER; se role = 'ADMIN', mantém ADMIN; caso contrário, USER
ALTER TABLE "User" ADD COLUMN "new_role" "Role";

UPDATE "User" 
SET "new_role" = 
  CASE 
    WHEN "superAdmin" = true THEN 'OWNER'::"Role"
    WHEN "role" = 'ADMIN' THEN 'ADMIN'::"Role"
    ELSE 'USER'::"Role"
  END;

-- Remover coluna antiga e renomear nova
ALTER TABLE "User" DROP COLUMN "role";
ALTER TABLE "User" DROP COLUMN "superAdmin";
ALTER TABLE "User" RENAME COLUMN "new_role" TO "role";

-- Definir valor padrão
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER'::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
