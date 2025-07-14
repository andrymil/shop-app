import { loadTemplate } from '/src/utils/templateLoader.js';

class ShopProductTemplate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.quantity = 1;

    loadTemplate('/src/components/shop-product/shop-product.html')
      .then(templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this.cacheElements();
        this.addEventListeners();

        if (this._product) this.renderProduct(this._product);
      })
      .catch(err =>
        console.error('Failed to load shop-product template:', err)
      );
  }

  cacheElements() {
    this.quantityDisplay = this.shadowRoot.getElementById('quantity');
    this.increaseButton = this.shadowRoot.querySelector(
      '.amount-buttons button:first-child'
    );
    this.decreaseButton = this.shadowRoot.querySelector(
      '.amount-buttons button:last-child'
    );
    this.cartButton = this.shadowRoot.getElementById('cartButton');
  }

  addEventListeners() {
    this.increaseButton?.addEventListener('click', () => {
      this.quantity++;
      this.updateQuantityDisplay();
    });

    this.decreaseButton?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        this.updateQuantityDisplay();
      }
    });

    this.cartButton?.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('add-to-cart', {
          detail: {
            product: { ...this._product, quantity: this.quantity },
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  updateQuantityDisplay() {
    if (this.quantityDisplay) {
      this.quantityDisplay.textContent = this.quantity;
    }

    this.decreaseButton.disabled = this.quantity === 1;
  }

  set product(data) {
    this._product = data;
    this.quantity = 1;
    this.renderProduct(data);
  }

  renderProduct(data) {
    const root = this.shadowRoot;
    if (!root.getElementById('name')) return;

    root.getElementById('name').textContent = data.name ?? 'Unknown';

    root.getElementById('manufacturer').textContent =
      data.manufacturer ?? 'Unknown';

    root.getElementById('description').textContent =
      data.description ?? 'Good product';

    const price = data.price ? Number(data.price).toFixed(2) + '$' : '0.00$';
    root.getElementById('price').textContent = price;

    const imageSrc = data.image
      ? `/public/products/${data.image}`
      : '/public/products/fallback.png';
    root.getElementById('image').src = imageSrc;

    this.updateQuantityDisplay();
  }
}

customElements.define('shop-product', ShopProductTemplate);
