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
    if (items.length === 0) {
        cartContainer.innerHTML = '';
        totalDisplay.hidden = true;
        cartEmptyDisplay.hidden = false;
        return;
    }

    const groups = groupByManufacturer(items);

    const existingBlocks = new Map();
    Array.from(cartContainer.children).forEach(child => {
        if (child.tagName === 'CART-MANUFACTURER' && child._manufacturer) {
            existingBlocks.set(child._manufacturer, child);
        }
    });

    const neededManufacturers = new Set(groups.map(g => g.manufacturer));

    existingBlocks.forEach((element, manufacturer) => {
        if (!neededManufacturers.has(manufacturer)) {
            cartContainer.removeChild(element);
        }
    });

    let grandTotal = 0;

    groups.forEach(group => {
        let el = existingBlocks.get(group.manufacturer);

        if (!el) {
            el = document.createElement('cart-manufacturer');
            cartContainer.appendChild(el);
        }
        el.data = group;

        group.products.forEach(p => {
            if (p.selected !== false) {
                grandTotal += (p.price ?? 0) * (p.quantity ?? 1);
            }
        });
    });

    totalDisplay.textContent = `Grand total: ${grandTotal.toFixed(2)}$`;
    totalDisplay.hidden = false;
    cartEmptyDisplay.hidden = true;
});
