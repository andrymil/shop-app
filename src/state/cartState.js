export const cartState = {
  items: [],

  addItem(product) {
    const existingItem = this.items.find(item => item.name === product.name);
    if (existingItem) {
      existingItem.quantity += product.quantity ?? 1;
    } else {
      this.items.push({
        ...product,
        quantity: product.quantity ?? 1,
        selected: true,
      });
    }
    this.notify();
  },

  removeItem(name) {
    this.items = this.items.filter(item => item.name !== name);
    this.notify();
  },

  toggleSelection(name, selected) {
    const item = this.items.find(items => items.name === name);
    if (item) {
      item.selected = selected;
    }
    this.notify();
  },

  updateQuantity(name, quantity) {
    const item = this.items.find(item => item.name === name);
    if (item) {
      item.quantity = quantity;
    }
    this.notify();
  },

  clear() {
    this.items = [];
    this.notify();
  },

  subscribe(callback) {
    this.listeners.push(callback);
  },

  listeners: [],
  notify() {
    for (const callback of this.listeners) {
      callback(this.items);
    }
  },
};
