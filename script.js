
let products = [

    {id: 1, name: "Headphones", price: 1200, category: "Electronics", image: "images/Headphones.png"},
    {id: 2, name: "Smart Watch", price: 2000, category: "Electronics", image: "images/SmartWatch.png"},
    {id: 3, name: "Bluetooth Speaker", price: 1500, category: "Electronics", image: "images/Speaker.png"},
    {id: 4, name: "Keyboard", price: 900, category: "Electronics", image: "images/Keyboard.png"},
    {id: 5, name: "Mouse", price: 500, category: "Electronics", image: "images/Mouse.png"},
    {id: 6, name: "Power Bank", price: 1800, category: "Electronics", image: "images/PowerBank.png"},

    {id: 7, name: "T-Shirt", price: 500, category: "Clothing", image: "images/T-Shirt.png"},
    {id: 8, name: "Shoes", price: 1500, category: "Clothing", image: "images/Shoes.png"},
    {id: 9, name: "Jacket", price: 2200, category: "Clothing", image: "images/Jacket.png"},
    {id: 10, name: "Jeans", price: 1200, category: "Clothing", image: "images/Jeans.png"},
    {id: 11, name: "Hoodie", price: 1000, category: "Clothing", image: "images/Hoodie.png"},
    {id: 12, name: "Cap", price: 300, category: "Clothing", image: "images/Cap.png"},

    {id: 13, name: "Backpack", price: 800, category: "Accessories", image: "images/BackPack.png"},
    {id: 14, name: "Sunglasses", price: 600, category: "Accessories", image: "images/Sunglasses.png"},
    {id: 15, name: "Wallet", price: 700, category: "Accessories", image: "images/Wallet.png"},
    {id: 16, name: "Watch", price: 1300, category: "Accessories", image: "images/Watch.png"},
    {id: 17, name: "Belt", price: 400, category: "Accessories", image: "images/Belt.png"},
    {id: 18, name: "Handbag", price: 1700, category: "Accessories", image: "images/Handbag.png"}
];

let cart = [];
let discountPercent = 0;

function displayProducts() {
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;
    let search = document.getElementById("search").value.toLowerCase();

    let list = products.filter(p =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(search)
    );

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    document.getElementById("products").innerHTML = list.map(p => `
        <div class="product">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p>₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join("");
}

function addToCart(id) {
    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({...products.find(p => p.id === id), quantity: 1});
    }

    updateCart();
}

function changeQuantity(id, amount) {
    let item = cart.find(p => p.id === id);
    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    updateCart();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    updateCart();
}

function updateCart() {
    let subtotal = 0;
    let count = 0;

    document.getElementById("items").innerHTML = cart.map(p => {
        subtotal += p.price * p.quantity;
        count += p.quantity;

        return `
            <div class="cart-item">
                ${p.name} - ₹${p.price} × ${p.quantity}
                <button onclick="changeQuantity(${p.id}, -1)">-</button>
                <button onclick="changeQuantity(${p.id}, 1)">+</button>
                <button onclick="removeItem(${p.id})">Remove</button>
            </div>
        `;
    }).join("") || "Cart is empty";

    let discount = Math.round(subtotal * discountPercent / 100);

    document.getElementById("count").innerText = count;
    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("discount").innerText = discount;
    document.getElementById("total").innerText = subtotal - discount;
}

function applyCoupon() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();

    if (cart.length === 0) {
        discountPercent = 0;
        document.getElementById("message").innerText = "Cart is empty";
    } else if (code === "SAVE10") {
        discountPercent = 10;
        document.getElementById("message").innerText = "10% discount applied";
    } else if (code === "SAVE20") {
        discountPercent = 20;
        document.getElementById("message").innerText = "20% discount applied";
    } else {
        discountPercent = 0;
        document.getElementById("message").innerText = "Invalid coupon";
    }

    updateCart();
}

function showCart() {
    document.getElementById("cart").scrollIntoView({behavior: "smooth"});
}

function checkout() {
    if (cart.length === 0) {
        alert("Add products first");
        return;
    }

    document.getElementById("checkout").style.display = "block";
    document.getElementById("checkout").scrollIntoView({behavior: "smooth"});
}

function placeOrder(event) {
    event.preventDefault();

    alert("Thank you, " + document.getElementById("name").value +
          "! Order placed. Total: ₹" +
          document.getElementById("total").innerText);

    cart = [];
    discountPercent = 0;
    document.getElementById("coupon").value = "";
    document.getElementById("message").innerText = "";
    document.querySelector("#checkout form").reset();
    document.getElementById("checkout").style.display = "none";

    updateCart();
}

document.getElementById("search").addEventListener("input", displayProducts);

displayProducts();
updateCart();
