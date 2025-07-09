import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import '/src/components/shop-product/shop-product.js';

class ShopComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    loadTemplate('/src/components/shop/shop.html')
      .then(async templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this._container = this.shadowRoot.getElementById('shop-products');
        await this.loadProducts();
        this.addEventListeners();
      })
      .catch(err => {
        console.error('Failed to load shop template:', err);
      });
  }

  async loadProducts() {
    try {
      const res = await fetch('/src/utils/data.json');
      const { products } = await res.json();

      products.forEach(product => {
        const element = document.createElement('shop-product');
        element.product = product;
        this._container.appendChild(element);
      });
    } catch (err) {
      console.error('Error fetching shop products:', err);
    }
  }

  addEventListeners() {
    this._container.addEventListener('add-to-cart', event => {
      const product = event.detail.product;
      cartState.addItem(product);
    });
  }
}

customElements.define('shop-component', ShopComponent);
