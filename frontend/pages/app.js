// food-delivery/frontend/js/app.js - Unified & Improved

const BASE_URL = "http://localhost/food-delivery/backend";
let currentUserId = null;

// Utility Functions
function getUserId() {
    return localStorage.getItem("user_id");
}

function showToast(message, type = "success") {
    alert(message); // Replace with custom toast later if needed
}

// ====================== AUTH ======================
async function loginUser(email, password) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.user_id) {
            localStorage.setItem("user_id", data.user_id);
            window.location.href = "../index.html";
        } else {
            showToast("Invalid email or password", "error");
        }
    } catch (err) {
        showToast("Login failed. Try again.", "error");
    }
}

async function registerUser(name, email, password) {
    try {
        const res = await fetch(`${BASE_URL}/auth/register.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (data.msg) {
            showToast("Account created successfully!");
            window.location.href = "login.html";
        } else {
            showToast("Registration failed", "error");
        }
    } catch (err) {
        showToast("Something went wrong", "error");
    }
}

// ====================== FOOD & MENU ======================
async function loadFoodMenu() {
    const container = document.getElementById("food");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/food/list.php`);
        const foods = await res.json();

        let html = "";
        foods.forEach(food => {
            const imgPath = food.image 
                ? `http://localhost/food-delivery/uploads/${food.image}` 
                : "https://via.placeholder.com/300x180?text=No+Image";

            html += `
                <div class="food-card">
                    <img src="${imgPath}" alt="${food.name}">
                    <div class="food-content">
                        <h3>${food.name}</h3>
                        <p class="restaurant">${food.restaurant}</p>
                        <div class="food-meta">
                            <span class="price">₹${parseFloat(food.price).toFixed(2)}</span>
                            <button onclick="addToCart(${food.id})" class="btn">Add</button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || `<p class="empty-state">No food items available at the moment.</p>`;
    } catch (e) {
        container.innerHTML = `<p class="empty-state">Failed to load menu. Please try again.</p>`;
    }
}

// ====================== CART ======================
async function addToCart(food_id) {
    const user_id = getUserId();
    if (!user_id) {
        showToast("Please login to add items to cart", "error");
        return;
    }

    try {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = "Adding...";
        btn.disabled = true;

        const res = await fetch(`${BASE_URL}/cart/add.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, food_id, quantity: 1 })
        });

        btn.textContent = "Added ✓";
        showToast("Item added to cart ✓");
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    } catch (e) {
        showToast("Failed to add item", "error");
        event.target.disabled = false;
        event.target.textContent = "Add";
    }
}

async function loadCart() {
    const user_id = getUserId();
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!container || !user_id) return;

    try {
        const res = await fetch(`${BASE_URL}/cart/view.php?user_id=${user_id}`);
        const items = await res.json();

        let html = "";
        let grandTotal = 0;

        items.forEach((item, index) => {
            const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
            grandTotal += itemTotal;

            html += `
                <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>₹${parseFloat(item.price).toFixed(2)} × ${item.quantity}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="item-total">₹${itemTotal.toFixed(2)}</div>
                        <button class="btn-danger" onclick="deleteFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || `<p class="empty-state">Your cart is empty</p>`;
        totalEl.textContent = `₹${grandTotal.toFixed(2)}`;

        localStorage.setItem("cart_total", grandTotal);
    } catch (e) {
        container.innerHTML = `<p class="empty-state">Error loading cart</p>`;
    }
}

async function deleteFromCart(cartId) {
    const user_id = getUserId();
    if (!user_id) return;

    try {
        await fetch(`${BASE_URL}/cart/delete.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, cart_id: cartId })
        });
        showToast("Item removed from cart");
        loadCart();
    } catch (e) {
        showToast("Failed to remove item", "error");
    }
}

// ====================== ORDER ======================
async function placeOrderCOD() {
    const user_id = getUserId();
    const total = parseFloat(localStorage.getItem("cart_total")) || 0;

    if (!user_id) return showToast("Please login first", "error");
    if (total <= 0) return showToast("Cart is empty", "error");

    try {
        const res = await fetch(`${BASE_URL}/order/place_cod.php?user_id=${user_id}`);
        const data = await res.json();

        if (data.order_id) {
            localStorage.setItem("order_id", data.order_id);
            showToast("Order placed successfully with Cash on Delivery!");
            window.location.href = "track.html";
        } else {
            showToast(data.error || "Failed to place order", "error");
        }
    } catch (e) {
        showToast("Failed to place order", "error");
    }
}

async function initiateRazorpayPayment() {
    const user_id = getUserId();
    if (!user_id) return showToast("Please login first", "error");

    try {
        const res = await fetch(`${BASE_URL}/order/create_payment.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const options = {
            key: "YOUR_RAZORPAY_KEY_HERE", // ← Replace with your Razorpay Key
            amount: data.amount,
            currency: "INR",
            name: "FoodApp",
            description: "Food Order Payment",
            handler: function (response) {
                verifyPayment(data.order_id, response.razorpay_payment_id);
            },
            prefill: {
                name: "Aditya",
                email: "user@example.com"
            },
            theme: { color: "#e8344a" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    } catch (err) {
        showToast(err.message || "Payment failed to start", "error");
    }
}

async function verifyPayment(order_id, payment_id) {
    try {
        await fetch(`${BASE_URL}/order/verify_payment.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id, payment_id })
        });
        localStorage.setItem("order_id", order_id);
        showToast("Payment Successful! 🎉");
        window.location.href = "track.html";
    } catch (e) {
        showToast("Payment verification failed", "error");
    }
}

async function trackCurrentOrder() {
    const order_id = localStorage.getItem("order_id");
    const statusEl = document.getElementById("status");
    const deliveryEl = document.getElementById("delivery");

    if (!order_id) {
        statusEl.innerHTML = `<p class="empty-state">No active order found.</p>`;
        return;
    }

    try {
        // Get order status
        let res = await fetch(`${BASE_URL}/order/status.php?order_id=${order_id}`);
        let data = await res.json();
        statusEl.textContent = data.status || "Processing";

        // Get delivery boy info
        res = await fetch(`${BASE_URL}/order/delivery_info.php?order_id=${order_id}`);
        data = await res.json();

        if (data.name) {
            deliveryEl.innerHTML = `
                <strong>Delivery Partner:</strong> ${data.name}<br>
                <strong>Phone:</strong> ${data.phone || 'Not available'}
            `;
        }
    } catch (e) {
        console.error(e);
    }
}

// ====================== ADMIN FUNCTIONS ======================
async function loadRestaurantsForDropdown() {
    const select = document.getElementById("restaurant_id");
    if (!select) return;

    try {
        const res = await fetch(`${BASE_URL}/admin/get_restaurants.php`);
        const data = await res.json();

        let html = `<option value="">Select Restaurant</option>`;
        data.forEach(r => {
            html += `<option value="${r.id}">${r.name} (${r.location || ''})</option>`;
        });
        select.innerHTML = html;
    } catch (e) {}
}

async function addNewRestaurant() {
    const name = document.getElementById("rname").value.trim();
    const location = document.getElementById("rlocation").value.trim();

    if (!name) return showToast("Restaurant name is required", "error");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);

    try {
        const res = await fetch(`${BASE_URL}/admin/add_restaurant.php`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            showToast("Restaurant added successfully!");
            document.getElementById("rname").value = "";
            document.getElementById("rlocation").value = "";
        } else {
            showToast(data.error || "Failed to add restaurant", "error");
        }
    } catch (e) {
        showToast("Error adding restaurant", "error");
    }
}

async function addNewFood() {
    const form = document.getElementById("addFoodForm");
    if (!form) return;

    const formData = new FormData(form);

    try {
        const res = await fetch(`${BASE_URL}/admin/add_food.php`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            showToast("Food item added successfully!");
            form.reset();
        } else {
            showToast(data.error || "Failed to add food", "error");
        }
    } catch (e) {
        showToast("Upload failed. Check image size/format.", "error");
    }
}

async function searchUserOrders() {
    const email = document.getElementById("user_email").value.trim();
    const container = document.getElementById("orders_list");

    if (!email) return showToast("Please enter user email", "error");

    try {
        const res = await fetch(`${BASE_URL}/admin/get_user_orders.php?email=${encodeURIComponent(email)}`);
        const orders = await res.json();

        let html = `<h3>Orders for ${email}</h3>`;
        if (orders.length === 0) {
            html += `<p class="empty-state">No orders found</p>`;
        } else {
            orders.forEach(o => {
                html += `
                    <div class="cart-item">
                        <div>Order #${o.id} • ₹${parseFloat(o.total_amount).toFixed(2)}</div>
                        <div><strong>${o.status}</strong></div>
                    </div>
                `;
            });
        }
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = `<p class="empty-state">Error fetching orders</p>`;
    }
}

async function updateUserOrdersStatus() {
    const email = document.getElementById("user_email").value.trim();
    const status = document.getElementById("order_status").value;

    if (!email || !status) return showToast("Email and status required", "error");

    try {
        const res = await fetch(`${BASE_URL}/admin/update_order_status.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, status })
        });
        const data = await res.json();

        showToast(data.status === "success" ? "Order status updated!" : (data.error || "Update failed"));
    } catch (e) {
        showToast("Failed to update status", "error");
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    currentUserId = getUserId();

    // Load food on home/index page
    if (document.getElementById("food")) loadFoodMenu();

    // Load cart on cart page
    if (document.getElementById("cart-items")) loadCart();

    // Track order
    if (document.getElementById("status")) trackCurrentOrder();

    // Admin - load restaurants in dropdown
    if (document.getElementById("restaurant_id")) loadRestaurantsForDropdown();
});