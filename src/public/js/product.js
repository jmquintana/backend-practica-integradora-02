const cartId = "643e1a3bcd4d41b659f78f79";
const form = document.querySelector(".add-form");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const productId = e.target.id;
	try {
		fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
		showAlert("Product added to cart", "success");
	} catch (error) {
		console.log(error);
	}
});

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
