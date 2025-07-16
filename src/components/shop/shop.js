import { cartState } from '/src/state/cartState.js';
import { loadTemplate } from '/src/utils/templateLoader.js';
import { showSnackbar } from '/src/utils/snackbar.js';
import '/src/components/shop-product/shop-product.js';
import '/src/components/sort-menu/sort-menu.js';

class ShopComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._allProducts = [];
    this._allProductElements = [];
    this._currentSort = { key: null, direction: 'asc' };

    loadTemplate('/src/components/shop/shop.html')
      .then(async templateContent => {
        this.shadowRoot.appendChild(templateContent);

        this.getElements();
        await this.loadProducts();
        this.addEventListeners();
      })
      .catch(err => {
        console.error('Failed to load shop template:', err);
      });
  }

  getElements() {
    this._container = this.shadowRoot.getElementById('shop-products');
    this._searchInput = this.shadowRoot.getElementById('search-input');
    this._sortMenu = this.shadowRoot.querySelector('sort-menu');
    this._shopEmptyDisplay = this.shadowRoot.querySelector('.shop-empty');
    this._clearButton = this.shadowRoot.getElementById('clear-search');
  }

  async loadProducts() {
    try {
      const res = await fetch('/src/utils/data.json');
      const { products } = await res.json();

      this._allProducts = products;
      this.renderProducts(products);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    }
  }

  renderProducts(products) {
    const isEmpty = !products.length;
    this._container.hidden = isEmpty;
    this._shopEmptyDisplay.hidden = !isEmpty;

    const existingMap = new Map();
    this._allProductElements.forEach(element => {
      existingMap.set(element.product.name, element);
    });

    const fragment = document.createDocumentFragment();
    this._allProductElements = [];

    products.forEach(product => {
      let element = existingMap.get(product.name);
      if (!element) {
        element = document.createElement('shop-product');
      }
      element.product = product;

      fragment.appendChild(element);
      this._allProductElements.push(element);
    });

    this._container.replaceChildren(fragment);
  }

  applyFiltersAndSorting() {
    const query = this._searchInput?.value.toLowerCase() ?? '';
    const { key, direction } = this._currentSort;

    let filtered = this._allProducts.filter(product => {
      const name = product.name.toLowerCase();
      const manufacturer = product.manufacturer.toLowerCase();
      return name.includes(query) || manufacturer.includes(query);
    });

    if (key) {
      filtered.sort((a, b) => {
        let aVal;
        let bVal;

        if (key === 'price') {
          aVal = a[key];
          bVal = b[key];
        } else {
          aVal = (a[key] ?? '').toString().toLowerCase();
          bVal = (b[key] ?? '').toString().toLowerCase();
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.renderProducts(filtered);
  }

  addEventListeners() {
    this._container.addEventListener('add-to-cart', event => {
      const product = event.detail.product;
      cartState.addItem(product);
      showSnackbar(`${product.name} added to cart`);
    });

    this._searchInput?.addEventListener('input', () => {
      const hasValue = this._searchInput.value.trim().length > 0;
      this._clearButton.hidden = !hasValue;
      this.applyFiltersAndSorting();
    });

    this._sortMenu?.addEventListener('sort-changed', event => {
      this._currentSort = event.detail;
      this.applyFiltersAndSorting();
    });

    this._clearButton?.addEventListener('click', () => {
      this._searchInput.value = '';
      this._clearButton.hidden = true;
      this.applyFiltersAndSorting();
    });
  }
}

customElements.define('shop-component', ShopComponent);
