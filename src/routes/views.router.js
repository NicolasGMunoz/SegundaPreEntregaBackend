import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.managers.js";
import CartManager from "../dao/dbManagers/carts.managers.js"

const router = Router()
const productManager = new ProductManager();
const cartManager = new CartManager();



router.get("/realtimeproducts", async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query = {} } = req.query;
		const options = {
			limit,
			page,
			query
		};
        const {
			docs: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		} = await productManager.getProducts(options);
		res.render("realtimeproducts", {
			products: productsList,
			hasPrevPage,
			hasNextPage,
			nextPage,
			prevPage
		});
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});


router.get("/products", async (req, res) => {
	try {
		const { limit = 10, page=1, sort, query: queryP, queryValue } = req.query;
		const options = {
			limit,
			page,
			query: {}
		}

		const {docs: productsList, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages} = await productManager.getProducts(options);
		const prevLink = hasPrevPage
			? `/products?limit=${limit}&page=${prevPage}${sortLink}${queryLink}`
			: null;
		const nextLink = hasNextPage
			? `/products?limit=${limit}&page=${nextPage}${sortLink}${queryLink}`
			: null;
		res.render("products", {
			products: productsList,
			totalPages,
			prevPage,
			nextPage,
			page,
			hasPrevPage,
			hasNextPage,
			prevLink,
			nextLink,
			style: "products.css"
		});
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});


router.get("/products/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await productManager.getProductById(pid);
		if (!product)
			return res.status(400).send({ error: error.message })
		return res.render("product", {
			product,
			style: "product.css"
		});
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.get("/carts/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const cart = await cartManager.getCartById(cid);
		if (!cart)
			return res.status(400).send({ error: error.message });
		const products = cart.products
		return res.render("cart", {
			products,
			style: "cart.css"
		});
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

export default router