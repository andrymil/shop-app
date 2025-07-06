import '/components/cart-manufacturer/cart-manufacturer.js';
import { cartState } from '/state/cartState.js';

const cartContainer = document.getElementById('cart-products');
const cartEmptyDisplay = document.getElementById('cart-empty');
const totalDisplay = document.getElementById('grand-total');

cartContainer.addEventListener('update-quantity', (event) => {
    const { name, quantity } = event.detail;
    cartState.updateQuantity(name, quantity);
});

cartContainer.addEventListener('remove-item', (event) => {
    const { name } = event.detail;
    cartState.removeItem(name);
});

cartContainer.addEventListener('toggle-selection', (event) => {
    const { name, selected } = event.detail;
    cartState.toggleSelection(name, selected);
});

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

    if (items.length === 0) {
        totalDisplay.hidden = true;
        cartEmptyDisplay.hidden = true;
        return;
    }

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

    totalDisplay.textContent = `Grand total: ${grandTotal.toFixed(2)}$`;
    totalDisplay.hidden = false;
    cartEmptyDisplay.hidden = true;
});
