import '/src/components/cart-manufacturer/cart-manufacturer.js';
import { cartState } from '/src/state/cartState.js';

const cartContainer = document.getElementById('cart-products');
const cartEmptyDisplay = document.getElementById('cart-empty');
const totalDisplay = document.getElementById('grand-total');
const badgeDisplay = document.getElementById('badge');
const clearButton = document.getElementById('clear-button');

function addEventListeners() {
  cartContainer.addEventListener('update-quantity', event => {
    const { name, quantity } = event.detail;
    cartState.updateQuantity(name, quantity);
  });

  cartContainer.addEventListener('remove-item', event => {
    const { name } = event.detail;
    cartState.removeItem(name);
  });

  cartContainer.addEventListener('toggle-selection', event => {
    const { name, selected } = event.detail;
    cartState.toggleSelection(name, selected);
  });
  clearButton.addEventListener('click', () => {
    cartState.clear();
  });
}

function groupByManufacturer(items) {
  const map = new Map();
  items.forEach(item => {
    const key = item.manufacturer ?? 'Unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()].map(([manufacturer, products]) => ({
    manufacturer,
    products,
  }));
}

function getExistingBlocks() {
  const existingBlocks = new Map();
  Array.from(cartContainer.children).forEach(child => {
    if (child.tagName === 'CART-MANUFACTURER' && child._manufacturer) {
      existingBlocks.set(child._manufacturer, child);
    }
  });

  return existingBlocks;
}

function deleteManufacturers(groups, existingBlocks) {
  const neededManufacturers = new Set(groups.map(g => g.manufacturer));

  existingBlocks.forEach((element, manufacturer) => {
    if (!neededManufacturers.has(manufacturer)) {
      cartContainer.removeChild(element);
    }
  });
}

function addManufacturers(groups, existingBlocks) {
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
}

function onCartChange(items) {
  badgeDisplay.textContent = items.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  if (items.length === 0) {
    cartContainer.innerHTML = '';
    cartContainer.hidden = true;
    totalDisplay.hidden = true;
    cartEmptyDisplay.hidden = false;
    clearButton.hidden = true;
    return;
  }

  const groups = groupByManufacturer(items);
  const existingBlocks = getExistingBlocks();

  deleteManufacturers(groups, existingBlocks);
  addManufacturers(groups, existingBlocks);

  cartEmptyDisplay.hidden = true;
  cartContainer.hidden = false;
  totalDisplay.hidden = false;
  clearButton.hidden = false;
}

addEventListeners();
cartState.subscribe(onCartChange);
