import { Router } from "express";
import { productsModel } from "../dao/dbManagers/models/products.models.js";
import ProductManager from '../dao/dbManagers/products.managers.js'

const router = Router();
const productManager = new ProductManager();

//Endpoint que muestra todos los productos y puede recibir un query param para mostrar menos productos si el cliente lo desea
router.get('/', async (req, res) => {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
        page: page,
        limit: limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query, status: true } : { status: true };

    try {
        const result = await productsModel.paginate(filter, options);
        res.send({
            status: 'success',
            payload: {
                docs: result.docs,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.prevPage : null,
                nextPage: result.hasNextPage ? result.nextPage : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
            }
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

//Endpoint que muestra el producto segun el id
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        res.send(product)
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

//Endpoint que crea un producto 
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        await productManager.addPorduct(product);
        res.send({ status: 'Success', payload: product });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Endpoint que actualiza un producto
router.put('/:pid', async (req, res) => {
    try {
        const id = Number(req.params.pid);
        const product = req.body;
        const tof = await productManager.updateProduct(id, product);
        const productUpdate = await productManager.getProductById(id);
        if (tof) {
            res.send({ status: 'succes', payload: productUpdate });
        } else {
            res.status(404).send({ message: 'Producto no encontrado / El codigo de producto ya existe' })
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }

});


//Endpoint que elimina un producto
router.delete('/:pid', async (req, res) => {
    try {
        const id = Number(req.params.pid);
        await productManager.deleteProduct(id);

        res.send({ status: 'Success', payload: `Product N° ${id} deleted` });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;