import '/components/cart-manufacturer/cart-manufacturer.js';
import { cartState } from '/state/cartState.js';

const cartContainer = document.getElementById('cart-products');

function groupByManufacturer(items) {
    const map = new Map();
    items.forEach(item => {
        const key = item.manufacturer ?? 'Unknown';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
    });
    return [...map.entries()].map(([manufacturer, products]) => ({ manufacturer, products }));
}

cartState.subscribe((items) => {
    cartContainer.innerHTML = '';

    const groups = groupByManufacturer(items);
    console.log("groups", groups);
    let grandTotal = 0;

    groups.forEach(group => {
        const el = document.createElement('cart-manufacturer');
        el.data = group;

        group.products.forEach(p => {
            grandTotal += (p.price ?? 0) * (p.quantity ?? 1);
        });

        cartContainer.appendChild(el);
    });

    const footer = document.createElement('div');
    footer.innerHTML = `<div class="grand-total">Grand total: ${grandTotal.toFixed(2)}$</div>`;
    footer.style.cssText = `
    background: #ddd;
    padding: 10px;
    text-align: right;
    font-weight: bold;
    border-top: 2px solid #999;
  `;
    cartContainer.appendChild(footer);
});

cartState.addItem({ manufacturer: "Lenovo", name: "Laptop", price: 10, quantity: 2 });
cartState.addItem({ manufacturer: "Lenovo", name: "Mouse", price: 100, quantity: 5 });
cartState.addItem({ manufacturer: "Dell", name: "Keyboard", price: 1000, quantity: 10 });

setTimeout(() => {
    cartState.updateQuantity("Mouse", 100);
}, 5000);
setTimeout(() => {
    cartState.removeItem("Keyboard");
}, 10000);
setTimeout(() => {
    cartState.clear();
}, 15000);
