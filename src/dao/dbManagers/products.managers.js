import { productsModel } from '../dbManagers/models/products.models.js'

export default class Products {
    constructor(){
    }

    getProducts = async () =>{
        const products = await productsModel.find().lean();
        return products;
    }

    getProductById = async (id) =>{
        const productFind = await productsModel.findById(id);
        return productFind;
    }

    updateProduct = async (id, product) =>{
        const productUpdated = await productsModel.updateOne({_id : id}, product, {new: true});
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