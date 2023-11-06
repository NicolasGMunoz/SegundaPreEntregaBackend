import { cartsModel } from './models/carts.models.js'

export default class Carts {
    constructor() { }

    getCart = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }

    addCart = async () => {
        const newCart = await cartsModel.create({});
        return newCart;
    }

    getCartById = async (id) => {
        const idCart = await cartsModel.find({ _id: id }).lean();
        return idCart;
    }

    updateCart = async (id, products) => {
        const updatedCart = await cartsModel.findOneAndUpdate(
            { _id: id },
            { $set: { products: products } },
            { new: true, runValidators: true }
        )
        if (!updatedCart) {
            throw new Error("Cart not found");
        }

        return updatedCart;
    };

    updateCartWithProducts = async (cartId, productsUpdate) => {
        const updateCart = await cartsModel.findByIdAndUpdate(
            cartId,
            {$set: { products: productsUpdate}},
            {new: true, runValidators: true}
        );
        return updateCart;
    };

    deleteCart = async (id) => {
        const cart = await cartsModel.find(id);
        if  (!cart){
            throw new Error("Cart not found.")
        }
        const cartDeleted = await cartsModel.deleteOne({ _id: id });
        return cartDeleted
    }
}