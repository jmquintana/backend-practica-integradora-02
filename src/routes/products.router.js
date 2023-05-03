// import ProductManager from "../managers/ProductManager.js";
import { Router } from "express";
import { uploader } from "../utils.js";
import socket from "../socket.js";
import { productModel } from "../models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
	try {
		let { limit, page, category, status, sort } = req.query;
		limit = parseInt(limit) || 5;
		page = parseInt(page) || 1;
		let products = await productModel.paginate(
			{},
			{
				limit,
				page,
				lean: true,
			}
		);
		return res.send({ status: "Success", payload: products });
	} catch (error) {
		console.log(error);
	}
});

router.get("/:pid", async (req, res) => {
	try {
		let productId = req.params.pid;
		const result = await productModel.find({ _id: productId });
		return res.send(result);
	} catch (error) {
		console.log(error);
	}
});

router.post("/", uploader.array("thumbnails", 10), async (req, res) => {
	try {
		let product = req.body;
		let files = req.files.splice(0, 4);
		if (!product) {
			return res.status(400).send({
				status: "Error",
				error: "Error, the product could no be added",
			});
		}

		product.thumbnails = [];

		if (files) {
			files.forEach((file) => {
				const imageUrl = `http://localhost:3000/images/${file.filename}`;
				product.thumbnails.push(imageUrl);
			});
		}

		const result = await productModel.create(product);
		const response = {
			ok: true,
			status: "Added",
			message: "Product added",
			result,
		};
		socket.io.emit("product_added", response);
		return res.send(response);
	} catch (error) {
		const response = {
			ok: false,
			status: "Error",
			message: "Product not added",
			error,
		};
		socket.io.emit("product_added", response);
	}
});

router.post("/many", async (req, res) => {
	try {
		const products = req.body;
		console.log(products);
		const productObject = products.slice(0, 100);
		const result = await productModel.insertMany(productObject);
		res.send({ status: "Success", payload: result });
	} catch (error) {
		console.log(error);
	}
});

router.put("/:pid", async (req, res) => {
	try {
		const productId = req.params.pid;
		const changes = req.body;
		if (!changes) {
			return res
				.status(400)
				.send({ status: "Error", error: "missing information" });
		}
		const result = await productModel.updateOne({ _id: productId }, changes);
		res.send({ status: "Success", payload: result });
	} catch (error) {
		console.log(error);
	}
});

router.delete("/:pid", async (req, res) => {
	try {
		const productId = req.params.pid;
		const result = await productModel.deleteOne({ _id: productId });
		socket.io.emit("product_deleted", productId);
		res.send({ status: "Success", payload: result });
	} catch (error) {
		console.log(error);
	}
});

export default router;
