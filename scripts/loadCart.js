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
            if (p.selected) {
                grandTotal += (p.price ?? 0) * (p.quantity ?? 1);
            }
        });

        cartContainer.appendChild(el);
    });

    const totalDisplay = document.getElementById('grand-total');
    totalDisplay.textContent = `Grand total: ${grandTotal.toFixed(2)}$`;
    totalDisplay.hidden = false;
});
