import { loadTemplate } from '../../utils/templateLoader.js';

class CartProduct extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        loadTemplate('/components/cart-product/cart-product.html')
            .then(templateContent => {
                this.shadowRoot.appendChild(templateContent);
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

    renderProduct(data) {
        if (!this.shadowRoot?.getElementById('name')) return;

        this.shadowRoot.getElementById('name').textContent = data.name ?? 'Unknown';
        this.shadowRoot.getElementById('price').textContent = data.price ? Number(data.price).toFixed(2) + '$' : '0.00$';
        this.shadowRoot.getElementById('quantity').textContent = data.quantity ?? 1;
    }
}

customElements.define('cart-product', CartProduct);
