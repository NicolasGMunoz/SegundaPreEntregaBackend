import { productsModel } from '../dbManagers/models/products.models.js'

export default class Products {
    constructor(){
    }

    getProducts = async () =>{
        const products = await productsModel.find();
        return products.map(p => p.toObject());
    }

    getProductById = async (id) =>{
        const productFind = await productsModel.find({_id : id});
        return productFind;
    }

    updateProduct = async (id, product) =>{
        const productUpdated = await productsModel.updateOne({_id : id}, product);
        return productUpdated;
    }
    
    addProduct = async (product) => {
        const newProduct = await productsModel.create(product);
        return newProduct;
    }

    deleteProduct = async (id) =>{
        const productDeleted = await productsModel.deleteOne({_id : id});
        return productDeleted;
    }
}