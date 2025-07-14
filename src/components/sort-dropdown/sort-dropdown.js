import { loadTemplate } from '/src/utils/templateLoader.js';

class SortDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    loadTemplate('/src/components/sort-dropdown/sort-dropdown.html').then(
      template => {
        this.shadowRoot.appendChild(template);
        this.init();
      }
    );
  }

  init() {
    this.toggleButton = this.shadowRoot.querySelector('.sort-toggle-btn');
    this.optionsMenu = this.shadowRoot.querySelector('.sort-options');

    this.currentSort = { key: null, direction: 'asc' };

    this.addEventListeners();
  }

  addEventListeners() {
    this.toggleButton.addEventListener('click', event => {
      event.stopPropagation();
      this.optionsMenu.classList.toggle('hidden');
    });

    this.optionsMenu.addEventListener(
      'click',
      this.handleSortChange.bind(this)
    );

    document.addEventListener('click', event => {
      const path = event.composedPath();

      if (!path.includes(this.optionsMenu)) {
        this.optionsMenu.classList.add('hidden');
      }
    });
  }

  handleSortChange(event) {
    const element = event.target.closest('li');
    if (!element) return;

    const sortKey = element.dataset.sort;
    const isSameKey = this.currentSort.key === sortKey;

    this.currentSort = {
      key: sortKey,
      direction:
        isSameKey && this.currentSort.direction === 'asc' ? 'desc' : 'asc',
    };

    this.shadowRoot.querySelectorAll('li').forEach(li => {
      li.classList.remove('selected');
      const arrowElement = li.querySelector('.arrow');
      if (arrowElement) {
        arrowElement.textContent = '';
      }
    });

    const arrow = this.currentSort.direction === 'asc' ? '↑' : '↓';
    this.toggleButton.innerHTML = `${this.capitalize(sortKey)}&nbsp;&nbsp;${arrow}`;

    element.classList.add('selected');
    const arrowElement = element.querySelector('.arrow');
    if (arrowElement) {
      arrowElement.textContent = arrow;
    }

    this.dispatchEvent(
      new CustomEvent('sort-changed', {
        detail: { ...this.currentSort },
        bubbles: true,
        composed: true,
      })
    );
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

customElements.define('sort-dropdown', SortDropdown);
