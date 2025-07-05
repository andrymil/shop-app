import { loadTemplate } from '../../utils/templateLoader.js';

class ShopProductTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        loadTemplate('/components/shop-product/shop-product.html')
            .then(templateContent => {
                this.shadowRoot.appendChild(templateContent);
                if (this._product) this.renderProduct(this._product);
            })
            .catch(err => {
                console.error("Failed to load template:", err);
            });
    }

    set product(data) {
        this._product = data;
        this.renderProduct(data);
    }

    renderProduct(data) {
        if (!this.shadowRoot?.getElementById('name')) return;

        this.shadowRoot.getElementById('name').textContent = data.name ?? "Unknown";
        this.shadowRoot.getElementById('producent').textContent = data.producent ?? "Unknown";
        this.shadowRoot.getElementById('description').textContent = data.description ?? "Good product";
        this.shadowRoot.getElementById('price').textContent = data.price ? Number(data.price).toFixed(2) + '$' : "0.00$";
        this.shadowRoot.getElementById('image').src = data.image ?? "public/image.png";
    }
}

customElements.define('shop-product', ShopProductTemplate);
