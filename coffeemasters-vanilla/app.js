import API from './services/api.js'
import Store from './services/store.js'
import Router from './services/router.js'
import { loadData } from './services/Menu.js'

// Link my Web Components
import { MenuPage } from './components/MenuPage.js';
import { DetailsPage } from './components/DetailsPage.js';
import { OrderPage } from './components/OrderPage.js';
import ProductItem from './components/ProductItem.js';

window.app = {}
app.store = Store;
app.router = Router;

// It's better to wait for the event for manipulation
window.addEventListener("DOMContentLoaded", async () => {
    app.router.init();
    loadData();
});

window.addEventListener("appcartchange", event => {
    const badge = document.getElementById("badge");
    const qty = app.store.cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = qty;
    badge.hidden = qty == 0;
});




