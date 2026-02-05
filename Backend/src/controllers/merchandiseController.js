import * as merchandiseService from './merchandiseService.js';
import fs from 'fs';

const normalizeMerchandise = (item) => {
    if (!item) return item;
    const variants = item.MerchandiseVariant || [];
    const { MerchandiseVariant, ...rest } = item;
    return { ...rest, variants };
};

export const createMerchandise = async (req, res) => {
    try {
        const { name, description, price, stock, available, category, variants } = req.body;

        let parsedVariants = [];
        if (variants) {
            parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        }
        
        // Construir URL da imagem se foi feito upload
        const imageUrl = req.file ? `/uploads/merchandise/${req.file.filename}` : null;
        
        const merchandise = await merchandiseService.create({
            name,
            description,
            price: parseFloat(price),
            stock: stock !== undefined ? parseInt(stock) : undefined,
            category,
            variants: parsedVariants,
            imageUrl,
            isActive: available !== undefined ? (available === 'true' || available === true) : true
        });
        
        res.status(201).json(normalizeMerchandise(merchandise));
    } catch (error) {
        // Se houver erro e foi feito upload, remover o ficheiro
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
};

export const getAllMerchandise = async (req, res) => {
    try {
        const merchandise = await merchandiseService.findAll();
        res.status(200).json(merchandise.map(normalizeMerchandise));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMerchandise = async (req, res) => {
    try {
        const { name, description, price, stock, available, category, variants } = req.body;

        let parsedVariants = undefined;
        if (variants !== undefined) {
            parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        }
        
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (category !== undefined) updateData.category = category;
        if (available !== undefined) updateData.isActive = available === 'true' || available === true;
        if (parsedVariants !== undefined) updateData.variants = parsedVariants;
        
        // Se foi feito upload de nova imagem
        if (req.file) {
            updateData.imageUrl = `/uploads/merchandise/${req.file.filename}`;
        }
        
        const merchandise = await merchandiseService.update(
            parseInt(req.params.id), 
            updateData
        );
        
        res.status(200).json(normalizeMerchandise(merchandise));
    } catch (error) {
        // Se houver erro e foi feito upload, remover o ficheiro
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ message: error.message });
    }
};

export const deleteMerchandise = async (req, res) => {
    // Apenas ADMIN pode deletar
    try {
        await merchandiseService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};