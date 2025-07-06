import "/components/shop-product/shop-product.js";
import { products } from "/data.js";
import { cartState } from "/state/cartState.js";

const container = document.getElementById("shop-products");

products.forEach(product => {
    const element = document.createElement('shop-product');
    element.product = product;
    container.appendChild(element);
});

container.addEventListener('add-to-cart', (event) => {
    const product = event.detail.product;
    cartState.addItem(product);
});
