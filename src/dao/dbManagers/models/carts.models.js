import mongoose from 'mongoose';

const cartsColletion = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

export const cartsModel = mongoose.model(cartsColletion, cartsSchema);