import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import { products } from '/data.js';
import '/src/components/shop-product/shop-product.js';

class ShopComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    loadTemplate('/src/components/shop/shop.html')
      .then(templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this._container = this.shadowRoot.getElementById('shop-products');
        this.loadProducts();
        this.addEventListeners();
      })
      .catch(err => {
        console.error('Failed to load shop template:', err);
      });
  }

  loadProducts() {
    products.forEach(product => {
      const element = document.createElement('shop-product');
      element.product = product;
      this._container.appendChild(element);
    });
  }

  addEventListeners() {
    this._container.addEventListener('add-to-cart', event => {
      const product = event.detail.product;
      cartState.addItem(product);
    });
  }
}

customElements.define('shop-component', ShopComponent);
