import "/components/shop-product/shop-product.js";
import { products } from "/data.js";

const container = document.getElementById("shop-products");

products.forEach(product => {
    const element = document.createElement('shop-product');
    element.product = product;
    container.appendChild(element);
})
