const incrementBtn = document.querySelectorAll(".increment-btn");
const decrementBtn = document.querySelectorAll(".decrement-btn");
const cartDeleteBtn = document.querySelectorAll(".cart-delete-btn");
const cartQuantity = document.querySelectorAll(".cart-quantity");
const cartTotal = document.querySelector(".cart-total-price-value");
const cartId = document.querySelector(".cart-main-container").id;

// Add product to cart
incrementBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		console.log(e.target);
		const { productId, newQuantity } = getProductValues(e, 1);
		addProductToCart(productId, cartId, newQuantity);
	});
});

// Delete product from cart
decrementBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		const { productId, newQuantity } = getProductValues(e, -1);
		deleteProductFromCart(productId, cartId, newQuantity);
	});
});

// Update cart quantity
const addProductToCart = async (productId, cartId, newQuantity) => {
	try {
		updateQuantityLabel(productId, newQuantity);
		updateProductTotal(productId);
		updateCartTotal();
		fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				return handleAddResponse(data);
			});
	} catch (error) {
		console.error(error);
	}
};

// Delete product from cart
const deleteProductFromCart = async (productId, cartId, newQuantity) => {
	if (newQuantity) {
		updateQuantityLabel(productId, newQuantity);
		updateProductTotal(productId);
	} else {
		document.getElementById(productId).remove();
	}
	updateCartTotal();
	try {
		await fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				return handleDeleteResponse(data);
			});
	} catch (error) {
		console.error(error);
	}
};

const getProductValues = (e, diff) => {
	const btnElement =
		e.target.parentNode.parentNode.querySelector(".circle-btn");
	const productElement = btnElement.parentNode.parentNode.parentNode.parentNode;
	const productId = productElement.id;
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	).innerText;
	const newQuantity = parseInt(productQuantityElement) + diff;
	return { productId, newQuantity };
};

const updateQuantityLabel = (productId, quantity) => {
	if (quantity === 0) {
		document.getElementById(productId).remove();
		// window.location.reload();
	}
	const productElement = document.getElementById(productId);
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	);
	productQuantityElement.innerText = quantity;
};

// update product sub-total
const updateProductTotal = (productId) => {
	const productElement = document.getElementById(productId);
	const productPriceElement = productElement.querySelector(
		".product-card-price-value"
	).innerText;
	const productQuantityElement = productElement.querySelector(
		".product-card-quantity-value"
	).innerText;
	const productTotalElement = productElement.querySelector(
		".product-card-total-value"
	);
	productTotalElement.innerText = productPriceElement * productQuantityElement;
};

// Update cart total
const updateCartTotal = () => {
	let total = 0;
	const cartSubTotal = document.querySelectorAll(".product-card-total-value");
	cartSubTotal.forEach((subtotal) => {
		total += parseInt(subtotal.innerText);
	});
	cartTotal.innerText = total;
};

const showAlert = (message, icon) => {
	Swal.fire({
		html: message,
		target: "#custom-target",
		customClass: {
			container: "position-absolute",
		},
		toast: true,
		position: "bottom-right",
		showConfirmButton: false,
		timer: 1500,
		icon: icon,
	});
};

// Handle responses from server
const handleAddResponse = (data) => {
	if (data.status === "Success") {
		showAlert("Product added to cart", "success");
	} else {
		showAlert("Product not added to cart", "error");
	}
};

const handleDeleteResponse = (data) => {
	if (data.status === "Success") {
		showAlert("Product removed from cart", "success");
	} else {
		showAlert("Product not removed from cart", "error");
	}
};
