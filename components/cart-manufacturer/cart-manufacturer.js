import { loadTemplate } from '../../utils/templateLoader.js';
import '../cart-product/cart-product.js';

class CartManufacturer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        loadTemplate('/components/cart-manufacturer/cart-manufacturer.html')
            .then(templateContent => {
                this.shadowRoot.appendChild(templateContent);
                if (this._data) this.render(this._data);
            })
            .catch(err => console.error('Failed to load cart-manufacturer template:', err));
    }

    set data({ manufacturer, products }) {
        this._data = { manufacturer, products };
        this.render(this._data);
    }

    render({ manufacturer, products }) {
        const label = this.shadowRoot.querySelector('.label');
        const productsContainer = this.shadowRoot.getElementById('products');
        const totalSpan = this.shadowRoot.getElementById('total');

        if (!label || !productsContainer || !totalSpan) return;

        label.textContent = manufacturer ?? 'Manufacturer';
        productsContainer.innerHTML = '';

        let sectionTotal = 0;

        products.forEach(product => {
            const el = document.createElement('cart-product');
            el.product = product;
            if (product.selected) {
                sectionTotal += (product.price ?? 0) * (product.quantity ?? 1);
            }
            productsContainer.appendChild(el);
        });

        totalSpan.textContent = `${sectionTotal.toFixed(2)}$`;
    }
}

customElements.define('cart-manufacturer', CartManufacturer);
