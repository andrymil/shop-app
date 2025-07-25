import { loadTemplate } from '/src/utils/templateLoader.js';

class CartProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    loadTemplate('/src/components/cart-product/cart-product.html')
      .then(templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this.getElements();
        this.addEventListeners();

        if (this._product) this.renderProduct(this._product);
      })
      .catch(err => {
        console.error('Failed to load cart-product template:', err);
      });
  }

  set product(data) {
    this._product = data;
    this.renderProduct(data);
  }

  getElements() {
    const root = this.shadowRoot;
    this.nameSpan = root.getElementById('name');
    this.priceSpan = root.getElementById('price');
    this.quantitySpan = root.getElementById('quantity');
    this.checkbox = root.querySelector('.product-select');
    this.plusButton = root.querySelector('.increase');
    this.minusButton = root.querySelector('.decrease');
    this.removeButton = root.querySelector('.remove');
  }

  addEventListeners() {
    const updateQuantity = getNewQuantity => () => {
      if (!this._product) return;

      const quantity = getNewQuantity(this._product.quantity);

      this.dispatchEvent(
        new CustomEvent('update-quantity', {
          detail: { name: this._product.name, quantity },
          bubbles: true,
          composed: true,
        })
      );
    };

    this.plusButton?.addEventListener(
      'click',
      updateQuantity(quantity => quantity + 1)
    );

    this.minusButton?.addEventListener(
      'click',
      updateQuantity(quantity => Math.max(1, quantity - 1))
    );

    this.removeButton?.addEventListener('click', () => {
      if (!this._product) return;

      this.dispatchEvent(
        new CustomEvent('remove-item', {
          detail: { name: this._product.name },
          bubbles: true,
          composed: true,
        })
      );
    });

    this.checkbox?.addEventListener('change', event => {
      if (!this._product) return;

      this.dispatchEvent(
        new CustomEvent('toggle-selection', {
          detail: { name: this._product.name, selected: event.target.checked },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  renderProduct(data) {
    if (
      !this.nameSpan ||
      !this.priceSpan ||
      !this.quantitySpan ||
      !this.checkbox
    ) {
      return;
    }

    this.minusButton.disabled = data.quantity === 1;
    this.checkbox.checked = data.selected !== false;
    this.nameSpan.textContent = data.name ?? 'Unknown';

    const price = data.price ? Number(data.price).toFixed(2) + '$' : '0.00$';
    this.priceSpan.textContent = price;

    this.quantitySpan.textContent = data.quantity ?? 1;
  }
}

customElements.define('cart-product', CartProduct);
