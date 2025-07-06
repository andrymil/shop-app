import { loadTemplate } from '../../utils/templateLoader.js';
import '../cart-product/cart-product.js';

class CartManufacturer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this._templateReady = loadTemplate('/components/cart-manufacturer/cart-manufacturer.html')
            .then(templateContent => {
                this.shadowRoot.appendChild(templateContent);
                if (this._data) {
                    this.updateProducts();
                    this.updateTotal();
                }
            })
            .catch(err => console.error('Failed to load cart-manufacturer template:', err));
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
            this.updateTotal();
        });
    }

    updateProducts() {
        const container = this.shadowRoot.getElementById('products');
        if (!container || !this._products) return;

        const existingMap = new Map();
        Array.from(container.children).forEach(node => {
            if (node.tagName === 'CART-PRODUCT') {
                const name = node._product?.name;
                if (name) {
                    existingMap.set(name, node);
                }
            }
        });

        const updatedNames = new Set(this._products.map(p => p.name));

        for (const [name, node] of existingMap.entries()) {
            if (!updatedNames.has(name)) {
                container.removeChild(node);
            }
        }

        this._products.forEach(product => {
            const existing = existingMap.get(product.name);
            if (existing) {
                existing.product = product;
                existingMap.delete(product.name);
            } else {
                const el = document.createElement('cart-product');
                el.product = product;
                container.appendChild(el);
            }
        });
    }

    updateTotal() {
        const totalSpan = this.shadowRoot.getElementById('total');
        if (!totalSpan || !this._products) return;

        const sectionTotal = this._products.reduce((sum, product) => {
            if (product.selected !== false) {
                return sum + (product.price ?? 0) * (product.quantity ?? 1);
            }
            return sum;
        }, 0);

        totalSpan.textContent = `${sectionTotal.toFixed(2)}$`;
    }
}

customElements.define('cart-manufacturer', CartManufacturer);