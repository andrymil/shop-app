import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import '/src/components/shop-product/shop-product.js';

class ShopComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._allProductElements = [];

    loadTemplate('/src/components/shop/shop.html')
      .then(async templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this.cacheELements();
        await this.loadProducts();
        this.addEventListeners();
      })
      .catch(err => {
        console.error('Failed to load shop template:', err);
      });
  }

  cacheELements() {
    this._container = this.shadowRoot.getElementById('shop-products');
    this._searchInput = this.shadowRoot.getElementById('search-input');
  }

  async loadProducts() {
    try {
      const res = await fetch('/src/utils/data.json');
      const { products } = await res.json();
      this.renderProducts(products);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    }
  }

  renderProducts(products) {
    products.forEach(product => {
      const element = document.createElement('shop-product');
      element.product = product;
      this._container.appendChild(element);
      this._allProductElements.push(element);
    });
  }

  addEventListeners() {
    this._container.addEventListener('add-to-cart', event => {
      const product = event.detail.product;
      cartState.addItem(product);
    });

    this._searchInput?.addEventListener('input', event => {
      const query = event.target.value.toLowerCase();

      this._allProductElements.forEach(element => {
        const name = element.product.name.toLowerCase();
        const manufacturer = element.product.manufacturer.toLowerCase();

        const isMatch = name.includes(query) || manufacturer.includes(query);
        element.style.display = isMatch ? '' : 'none';
      });
    });
  }
}

customElements.define('shop-component', ShopComponent);
