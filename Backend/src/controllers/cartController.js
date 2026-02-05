import * as cartService from '../services/cart.service.js';

export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addItemToCart = async (req, res) => {
    const { merchandiseId, quantity, size } = req.body;
    try {
        const cart = await cartService.addItemToCart(req.user.id, merchandiseId, quantity, size);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateItemQuantity = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartService.updateCartItemQuantity(parseInt(cartItemId, 10), quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removeItemFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await cartService.removeItemFromCart(parseInt(itemId, 10));
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user.id);
        await cartService.clearCart(cart.id);
        const updated = await cartService.getOrCreateCart(req.user.id);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};