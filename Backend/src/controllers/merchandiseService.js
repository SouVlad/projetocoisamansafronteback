import prisma from '../prisma.js';

// Validação de entrada pode ser adicionada aqui com bibliotecas como Zod ou Joi

export const create = async (data) => {
    const { variants, category, ...rest } = data;
    const variantData = Array.isArray(variants) ? variants : [];
    const totalVariantStock = variantData.length
        ? variantData.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)
        : undefined;

    return prisma.merchandise.create({
        data: {
            ...rest,
            category: category || undefined,
            stock: totalVariantStock !== undefined ? totalVariantStock : rest.stock,
            MerchandiseVariant: variantData.length
                ? {
                      createMany: {
                          data: variantData.map((v) => ({
                              size: v.size,
                              stock: parseInt(v.stock, 10) || 0,
                              updatedAt: new Date(),
                          })),
                      },
                  }
                : undefined,
        },
        include: { MerchandiseVariant: true },
    });
};

export const findAll = async () => {
    return prisma.merchandise.findMany({
        include: { MerchandiseVariant: true }
    });
};

export const update = async (id, data) => {
    const merchandiseId = parseInt(id, 10);
    const { variants, category, ...rest } = data;
    const variantData = Array.isArray(variants) ? variants : null;
    const totalVariantStock = variantData
        ? variantData.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)
        : undefined;

    return prisma.$transaction(async (tx) => {
        await tx.merchandise.update({
            where: { id: merchandiseId },
            data: {
                ...rest,
                category: category || undefined,
                stock: totalVariantStock !== undefined ? totalVariantStock : rest.stock,
            },
        });

        if (variantData !== null) {
            await tx.merchandiseVariant.deleteMany({
                where: { merchandiseId },
            });

            if (variantData.length) {
                await tx.merchandiseVariant.createMany({
                    data: variantData.map((v) => ({
                        merchandiseId,
                        size: v.size,
                        stock: parseInt(v.stock, 10) || 0,
                        updatedAt: new Date(),
                    })),
                });
            }
        }

        return tx.merchandise.findUnique({
            where: { id: merchandiseId },
            include: { MerchandiseVariant: true },
        });
    });
};

export const remove = async (id) => {
    const merchandiseId = parseInt(id, 10);

    return prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({
            where: { merchandiseId },
        });

        await tx.merchandiseVariant.deleteMany({
            where: { merchandiseId },
        });

        return tx.merchandise.delete({
            where: { id: merchandiseId },
        });
    });
};