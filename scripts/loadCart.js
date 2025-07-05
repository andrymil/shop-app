import '/components/cart-product/cart-product.js';

const cartContainer = document.querySelector('.cart');

const cartItems = [
    { name: "Product Name", price: 10, quantity: 5 },
    { name: "Product Name", price: 10, quantity: 10 },
    { name: "Product Name", price: 10, quantity: 1 }
];

cartItems.forEach(item => {
    const element = document.createElement('cart-product');
    element.product = item;
    cartContainer.appendChild(element);
});
