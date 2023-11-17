import express from 'express';
import {productsModel} from '../dao/dbManagers/models/products.models.js';
import {cartsModel} from '../dao/dbManagers/models/carts.models.js';
import CartManager from '../dao/dbManagers/carts.managers.js'

const router = express.Router();

router.get('/products', async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    try {
        const options = {
            page: page,
            limit: limit,
            lean: true,
            leanWithId: false
        };

        const result = await productsModel.paginate({}, options);

        res.render('products', {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: result.limit
        });
    } catch (error) {
        res.status(500).send('Error al cargar la lista');
    }
});


router.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productsModel.findById(productId);

        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado.' });
        }
        const productObject = product.toObject();

        res.render('productsDetail', { product: productObject });
    } catch (error) {
        res.status(500).send('Error al cargar la lista');
    }
});


router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartsModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        const productsWithSubtotals = cart.products.map(item => {
            return {
                ...item.toObject(), 
                subtotal: item.quantity * item.product.price 
            };
        });

        res.render('cart', { products: productsWithSubtotals });
    } catch (error) {
        res.status(500).send('Error al cargar la lista');
    }
});


router.post('/carts/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;

        const cart = await cartsModel.findOne({ _id: cartId, userId: req.session.user._id });
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const product = await productsModel.findById(productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        cart.products.push({ product: productId, quantity });
        await cart.save();

        res.status(200).send({ message: 'Producto añadido al carrito', cartId: cart._id });
    } catch (error) {
        res.status(500).send('Error al cargar la lista');
    }
});


export default router;
