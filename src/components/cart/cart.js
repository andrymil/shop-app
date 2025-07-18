import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import { showSnackbar } from '/src/utils/snackbar.js';
import { showLoader, hideLoader } from '/src/utils/loader.js';
import '/src/components/cart-manufacturer/cart-manufacturer.js';

class CartComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    loadTemplate('/src/components/cart/cart.html')
      .then(templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this.getElements();
        this.addEventListeners();

        cartState.subscribe(this.onCartChange.bind(this));
      })
      .catch(err => {
        console.error('Failed to load cart template:', err);
      });
  }

  getElements() {
    const root = this.shadowRoot;
    this._cartContainer = root.getElementById('cart-products');
    this._cartEmptyDisplay = root.getElementById('cart-empty');
    this._totalDisplay = root.getElementById('grand-total');
    this._badgeDisplay = root.getElementById('badge');
    this._clearButton = root.getElementById('clear-button');
    this._buyButton = root.getElementById('buy-button');
  }

  addEventListeners() {
    this._cartContainer.addEventListener('update-quantity', event => {
      const { name, quantity } = event.detail;
      cartState.updateQuantity(name, quantity);
    });

    this._cartContainer.addEventListener('remove-item', event => {
      const { name } = event.detail;
      cartState.removeItem(name);
      showSnackbar(`${name} removed from cart`, 'red');
    });

    this._cartContainer.addEventListener('toggle-selection', event => {
      const { name, selected } = event.detail;
      cartState.toggleSelection(name, selected);
    });

    this._clearButton.addEventListener('click', () => {
      cartState.clear();
      showSnackbar('Cart has been cleared', 'red');
    });

    this._buyButton.addEventListener('click', () => {
      this.handleBuy();
    });
  }

  async handleBuy() {
    showLoader();

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log(
        'Products',
        cartState.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
        }))
      );
      cartState.clear();
      showSnackbar('Thank you for your purchase!');
    } finally {
      hideLoader();
    }
  }

  groupByManufacturer(items) {
    const map = new Map();

    items.forEach(item => {
      const key = item.manufacturer ?? 'Unknown';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });
    return [...map.entries()].map(([manufacturer, products]) => ({
      manufacturer,
      products,
    }));
  }

  getExistingBlocks() {
    const existingBlocks = new Map();

    Array.from(this._cartContainer.children).forEach(child => {
      if (child.tagName === 'CART-MANUFACTURER' && child._manufacturer) {
        existingBlocks.set(child._manufacturer, child);
      }
    });

    return existingBlocks;
  }

  deleteManufacturers(groups, existingBlocks) {
    const neededManufacturers = new Set(groups.map(g => g.manufacturer));

    existingBlocks.forEach((element, manufacturer) => {
      if (!neededManufacturers.has(manufacturer)) {
        this._cartContainer.removeChild(element);
      }
    });
  }

  addManufacturers(groups, existingBlocks) {
    let grandTotal = 0;

    groups.forEach(group => {
      let element = existingBlocks.get(group.manufacturer);

      if (!element) {
        element = document.createElement('cart-manufacturer');
        this._cartContainer.appendChild(element);
      }
      element.data = group;

      group.products.forEach(product => {
        if (product.selected !== false) {
          grandTotal += (product.price ?? 0) * (product.quantity ?? 1);
        }
      });
    });

    this._totalDisplay.textContent = `Grand total: ${grandTotal.toFixed(2)}$`;
  }

  onCartChange(items) {
    this._badgeDisplay.textContent = items.reduce(
      (acc, product) => acc + product.quantity * Number(product.selected),
      0
    );

    if (items.length === 0) {
      this._cartContainer.innerHTML = '';
      this._cartContainer.hidden = true;
      this._totalDisplay.hidden = true;
      this._cartEmptyDisplay.hidden = false;
      this._clearButton.hidden = true;
      this._buyButton.hidden = true;
      return;
    }

    const groups = this.groupByManufacturer(items);
    const existingBlocks = this.getExistingBlocks();

    this.deleteManufacturers(groups, existingBlocks);
    this.addManufacturers(groups, existingBlocks);

    this._cartEmptyDisplay.hidden = true;
    this._cartContainer.hidden = false;
    this._totalDisplay.hidden = false;
    this._clearButton.hidden = false;
    this._buyButton.hidden = false;
  }
}

customElements.define('cart-component', CartComponent);
