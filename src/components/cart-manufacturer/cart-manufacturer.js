import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import '/src/components/cart-product/cart-product.js';

class CartManufacturer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._templateReady = loadTemplate(
      '/src/components/cart-manufacturer/cart-manufacturer.html'
    )
      .then(templateContent => {
        this.shadowRoot.appendChild(templateContent);

        if (this._data) {
          this.updateProducts();
        }
        this.cacheELements();
        this.addEventListeners();
      })
      .catch(err =>
        console.error('Failed to load cart-manufacturer template:', err)
      );
  }

  set data({ manufacturer, products }) {
    this._manufacturer = manufacturer;
    this._products = products;

    this._templateReady.then(() => {
      const label = this.shadowRoot.querySelector('.label');
      if (label) {
        label.textContent = manufacturer ?? 'Manufacturer';
      }

      this.updateProducts();
    });
  }

  cacheELements() {
    this._checkbox = this.shadowRoot.querySelector('.manufacturer-select');
    this._container = this.shadowRoot.getElementById('products');
    this._totalSpan = this.shadowRoot.getElementById('total');
  }

  addEventListeners() {
    this._checkbox?.addEventListener('change', event => {
      this._products.forEach(product => {
        cartState.toggleSelection(product.name, event.target.checked);
      });
    });
  }

  updateProducts() {
    if (!this._container || !this._products) return;

    const existingMap = this.getExistingBlocks();

    this.deleteProducts(existingMap);
    this.addProducts(existingMap);
    this.updateCheckbox();
    this.updateTotal();
  }

  getExistingBlocks() {
    const existingMap = new Map();

    Array.from(this._container.children).forEach(node => {
      if (node.tagName === 'CART-PRODUCT') {
        const name = node._product?.name;
        if (name) {
          existingMap.set(name, node);
        }
      }
    });

    return existingMap;
  }

  deleteProducts(existingMap) {
    const updatedNames = new Set(this._products.map(product => product.name));

    for (const [name, node] of existingMap.entries()) {
      if (!updatedNames.has(name)) {
        this._container.removeChild(node);
      }
    }
  }

  addProducts(existingMap) {
    this._selected = true;

    this._products.forEach(product => {
      if (!product.selected) {
        this._selected = false;
      }

      const existing = existingMap.get(product.name);
      if (existing) {
        existing.product = product;
        existingMap.delete(product.name);
      } else {
        const el = document.createElement('cart-product');
        el.product = product;
        this._container.appendChild(el);
      }
    });
  }

  updateCheckbox() {
    this._checkbox.checked = this._selected;
  }

  updateTotal() {
    if (!this._totalSpan || !this._products) return;

    const sectionTotal = this._products.reduce((sum, product) => {
      if (product.selected) {
        const price = (product.price ?? 0) * (product.quantity ?? 1);
        return sum + price;
      }
      return sum;
    }, 0);

    this._totalSpan.textContent = `${sectionTotal.toFixed(2)}$`;
  }
}

customElements.define('cart-manufacturer', CartManufacturer);
