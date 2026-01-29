import * as merchandiseService from './merchandiseService.js';
import fs from 'fs';

export const createMerchandise = async (req, res) => {
    try {
        const { name, description, price, stock, available } = req.body;
        
        // Construir URL da imagem se foi feito upload
        const imageUrl = req.file ? `/uploads/merchandise/${req.file.filename}` : null;
        
        const merchandise = await merchandiseService.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            imageUrl,
            isActive: available !== undefined ? (available === 'true' || available === true) : true
        });
        
        res.status(201).json(merchandise);
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
        res.status(200).json(merchandise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMerchandise = async (req, res) => {
    try {
        const { name, description, price, stock, available } = req.body;
        
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (available !== undefined) updateData.isActive = available === 'true' || available === true;
        
        // Se foi feito upload de nova imagem
        if (req.file) {
            updateData.imageUrl = `/uploads/merchandise/${req.file.filename}`;
        }
        
        const merchandise = await merchandiseService.update(
            parseInt(req.params.id), 
            updateData
        );
        
        res.status(200).json(merchandise);
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